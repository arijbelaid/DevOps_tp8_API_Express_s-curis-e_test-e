import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import pg from "pg";
import { createApp } from "../../src/app.js";
import { createPgContactRepository } from "../../src/repositories/contactRepository.js"; // <-- BON NOM ICI

const { Pool } = pg;

describe("Intégration Contact API (PostgreSQL)", () => {
  let app;
  let pool;
  let repository;

  beforeAll(async () => {
    pool = new Pool({
      host: process.env.PGHOST || "localhost",
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "contacts",
    });
    
    // <-- BON NOM ICI
    repository = createPgContactRepository(pool); 
    app = createApp({ contactRepository: repository });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("enregistre un contact dans la vraie base de données", async () => {
    await pool.query("TRUNCATE TABLE contacts RESTART IDENTITY CASCADE");

    const res = await request(app)
      .post("/api/contact")
      .send({ 
        name: "Integration Test", 
        email: "integration@example.com", 
        message: "Ceci est un test d'intégration" 
      });

    expect(res.status).toBe(201);

    const dbResult = await pool.query("SELECT * FROM contacts WHERE email = $1", ["integration@example.com"]);
    expect(dbResult.rows.length).toBe(1);
    expect(dbResult.rows[0].name).toBe("Integration Test");
  });
});

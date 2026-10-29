export function errorHandler(err, req, res, next) {
  // On log l'erreur côté serveur UNIQUEMENT si on n'est pas en mode test
  if (!process.env.VITEST) {
    console.error("Erreur serveur:", err.stack || err);
  }

  // Gestion du JSON malformé
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "INVALID_JSON" });
  }

  // Gestion du corps trop volumineux
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: "PAYLOAD_TOO_LARGE" });
  }

  // Gestion des erreurs internes (500) : pas de stack trace côté client
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  
  res.status(status).json({ error: code });
}

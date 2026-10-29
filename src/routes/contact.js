import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactSchema } from "../schemas/contact.js";
import { validate } from "../middlewares/validate.js";

export function createContactRouter(contactRepository) {
  const router = Router();

  // Le limiteur est défini ICI pour être recréé à chaque nouveau test/app
  const contactLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: "TOO_MANY_REQUESTS" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  router.post("/", contactLimiter, validate(contactSchema), async (req, res, next) => {
    try {
      const { name, email, message } = req.body;
      await contactRepository.create({ name, email, message });
      res.status(201).json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

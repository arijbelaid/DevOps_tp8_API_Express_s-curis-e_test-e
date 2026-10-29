export function validate(schema) {
  return (req, res, next) => {
    // safeParse valide les données sans lever d'exception
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      // Formater les erreurs pour correspondre au format attendu
      const details = result.error.errors.map(err => ({
        field: err.path.join('.'), // ex: "email"
        message: err.message        // ex: "Format d'email invalide"
      }));
      
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        details
      });
    }
    
    // Si c'est valide, on remplace req.body par les données nettoyées (trim, etc.)
    req.body = result.data;
    next();
  };
}

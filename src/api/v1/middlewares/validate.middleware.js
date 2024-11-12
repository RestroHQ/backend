export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  };
};

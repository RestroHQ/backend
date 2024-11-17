import { errorHandler } from "@/lib/error-handler";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;

      next();
    } catch (error) {
      errorHandler(error, res);
    }
  };
};

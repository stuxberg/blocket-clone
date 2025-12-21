import { validationResult } from "express-validator";

export function handleValidationErrors(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    return res.status(400).json({
      message: errors[0].msg, // First error message
      errors: errors, // All errors for detailed display
    });
  }
  next();
}

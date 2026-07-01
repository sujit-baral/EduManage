/**
 * Zod validation middleware factory.
 * Wraps a Zod schema and validates req.body against it.
 * Strips unknown fields automatically.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    const firstIssue = result.error.issues[0];
    const message = `Validation error: ${firstIssue.path.join(".")} — ${firstIssue.message}`;
    return next(new Error(message));
  }
  req.body = result.data; // strips unknown/extra fields
  next();
};

export default validate;

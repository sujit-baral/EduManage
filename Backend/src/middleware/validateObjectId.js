import mongoose from "mongoose";

export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      return next(new Error(`Invalid ID format: ${id}`));
    }
    next();
  };
};

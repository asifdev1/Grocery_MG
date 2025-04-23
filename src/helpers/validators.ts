import { NextFunction, Request, Response } from "express";
import Joi from "joi";

//  define schemas for validation of request body parameters
const userSchema = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.min": "First name must be at least 2 characters long",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.min": "Last name must be at least 2 characters long",
    "any.required": "Last name is required",
  }),
  middleName: Joi.string().min(2).optional().messages({
    "string.min": "Middle name must be at least 2 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email is not valid",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  phone: Joi.string().min(10).required().messages({
    "string.min": "Phone number must be at least 10 digits long",
    "any.required": "Phone number is required",
  }),
});

const userIdSchema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
});

//  validate request body parameters
const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(400).json({ errors });
      return;
    }
    next();
  };
};

// validate request parameters
const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }
    next();
  };
};

//  actual functions to call in express routes
export const validateUser = validateBody(userSchema);

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

const productSchema = Joi.object({
  productName: Joi.string().min(2).required().messages({
    "string.min": "Product name must be at least 2 characters long",
    "any.required": "Product name is required",
  }),
  productType: Joi.string().min(2).required().messages({
    "string.min": "Product type must be at least 2 characters long",
    "any.required": "Product type is required",
  }),
  supplierId: Joi.string().min(2).required().messages({
    "string.min": "Supplier ID must be at least 2 characters long",
    "any.required": "Supplier ID is required",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Price must be positive",
    "any.required": "Price is required",
  }),
  sellingPrice: Joi.number().min(0).required().messages({
    "number.min": "Selling price must be positive",
    "any.required": "Selling price is required",
  }),
});

const taskSchema = Joi.object({
  taskType: Joi.string()
    .valid(["Order-related", "Shipment-related", "Payment-related", "Others"])
    .required()
    .messages({
      "any.only": "Please enter a valid type of the task",
    }),
  assignee: Joi.string().required().message("Please enter a assignee"),
  priorityLevel: Joi.string()
    .valid(["Critical", "High", "Moderate", "Low"])
    .required()
    .message("Please enter a valid priority level"),
  description: Joi.string()
    .min(5)
    .optional()
    .message("Please enter a long enough description"),
  dueDate: Joi.date().required().message("Please enter a valid date"),
  location: Joi.string().required().message("Please enter a valid location"),
});

const blogSchema = Joi.object({
  title: Joi.string().min(5).required().messages({
    "string.min": "Blog title is too short",
    "any.required": "Blog title is required",
  }),
  image: Joi.string().min(5).optional(),
  description: Joi.string().min(5).required().messages({
    "string.min": "Blog description is too short",
    "any.required": "description is required",
  }),
});

const blogParamSchema = Joi.object({
  page: Joi.number().min(1).default(1).required(),
  offset: Joi.number().min(0).default(10).required(),
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
      res.status(400).json({ errors });
      return;
    }
    next();
  };
};

//  actual functions to call in express routes
export const validateUser = validateBody(userSchema);
export const validateBlog = validateBody(blogSchema);
export const validateBlogParam = validateParams(blogParamSchema);
export const validateProduct = validateBody(productSchema);
export const validateTask = validateBody(taskSchema);

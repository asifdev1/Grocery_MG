import { Response } from "express";
export const handleSuccess = (res: Response, data: any, method: string) => {
  // Handle success response
  console.log(`Success in method: ${method}, Data : `, data || "None");

  return res.status(200).json(data);
};

export const handleError = (res: Response, error: any, method: string) => {
  // Handle success response
  console.log(`Error in method: ${method}, Error : `, error || "None");

  return res.status(400).json({ error: error });
};

export const handleServerError = (
  res: Response,
  error: any,
  method: string
) => {
  console.log(`Server error in method: ${method}, Error : `, error || "None");
  return res
    .status(500)
    .json({ error: "Oops! Server failed due to some reason :(" });
};

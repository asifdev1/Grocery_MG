import { Response } from "express";
import { CustomRequest } from "../middleware";
import { handleServerError, handleSuccess } from "../helpers";
import { Product } from "../models";
import moment from "moment";

export default {
  AddStock: async (req: CustomRequest, res: Response) => {
    try {
      const {
        productName,
        productType,
        supplierId,
        quantity,
        price,
        sellingPrice,
      } = req.body;

      const newProduct = await Product.create({
        productName,
        productType,
        supplierId,
        quantity,
        price,
        sellingPrice,
      });

      handleSuccess(res, { product_id: newProduct._id }, "AddStock");
    } catch (error) {
      handleServerError(res, error, "AddStock");
    }
  },

  GetStockDetails: async (req: CustomRequest, res: Response) => {
    try {
      const { page, offset, status } = req.query;

      let matchCondition = {};

      if (status == "available")
        matchCondition = {
          quantity: {
            $gt: 0,
          },
        };
      else if (status == "unavailable")
        matchCondition = {
          quantity: 0,
        };
      else if (status == "low-stock")
        matchCondition = {
          quantity: {
            $lt: 10,
          },
        };

      const stocks = await Product.find(matchCondition)
        .skip(Number(offset) * (Number(page) - 1))
        .limit(Number(offset));

      handleSuccess(res, { stocks }, "GetStockDetails");
    } catch (error) {
      handleServerError(res, error, "GetStockDetails");
    }
  },

  GetNewStocks: async (req: CustomRequest, res: Response) => {
    try {
      const yesterday = moment().subtract(1, "day").startOf("day");

      const newStocks = await Product.find({
        createdAt: {
          $gte: yesterday.toDate(),
        },
      }).sort({ createdAt: -1 });

      const filterNewStocks = newStocks.map((stock) => {
        return {
          productId: stock._id,
          productName: stock.productName,
          quantity: stock.quantity,
          dateAdded: moment(stock.createdAt).format("YYYY-MM-DD"),
        };
      });

      handleSuccess(res, { newStock: filterNewStocks }, "GetNewStocks");
    } catch (error) {
      handleServerError(res, error, "GetNewStocks");
    }
  },

  // GetStockSummary: async (req: CustomRequest, res: Response) => {
  //   try {
  //     const totalStock = await Product.find().countDocuments();
  //     const lowStock = await Product.find({
  //       quantity: {
  //         $lt: 10,
  //       },
  //     }).countDocuments();
  //     const outOfStock = await Product.find({
  //       quantity: 0,
  //     }).countDocuments();

  //       const HighDemandStock = await Product.aggregate([
  //         {
  //           $lookup : {
  //             from : "Order",
  //             localField : "_id",
  //             foreignField : "productId",
  //             as : "orderDetails"
  //           }
  //         }
  //       ])
  //   } catch (error) {
  //     handleServerError(res, error, "GetStockSummary");
  //   }a
  // },
};

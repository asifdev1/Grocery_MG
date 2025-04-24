import { Response } from "express";
import { CustomRequest } from "../middleware";
import { handleServerError, handleSuccess } from "../helpers";
import Order from "../models/order";
import moment from "moment";

export default {
  GetOrderSummary: async (req: CustomRequest, res: Response) => {
    try {
      const { startDate, endDate, type } = req.query;

      let fromDate = moment(startDate as string).toDate(),
        toDate = moment(endDate as string).toDate();

      if (type == "daily") {
        fromDate = moment().startOf("day").toDate();
        toDate = moment().endOf("day").toDate();
      } else if (type == "weekly") {
        fromDate = moment().startOf("week").toDate();
        toDate = moment().endOf("week").toDate();
      } else if (type == "monthly") {
        fromDate = moment().startOf("month").toDate();
        toDate = moment().endOf("month").toDate();
      } else if (type == "3months") {
        fromDate = moment().subtract(3, "months").startOf("month").toDate();
        toDate = moment().endOf("month").toDate();
      } else if (type == "6months") {
        fromDate = moment().subtract(6, "months").startOf("month").toDate();
        toDate = moment().endOf("month").toDate();
      }

      const activeOrders = await Order.find({
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
        status: {
          $or: ["Pending", "In-transit"],
        },
      }).countDocuments();

      const inactiveOrders = await Order.find({
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
        status: {
          $or: ["Delivered", "Failed"],
        },
      }).countDocuments();

      handleSuccess(
        res,
        { Active: activeOrders, Inactive: inactiveOrders },
        "GetOrderSummary"
      );
    } catch (error) {
      handleServerError(res, error, "GetOrderStatus");
    }
  },

  GetShipmentCounts: async (req: CustomRequest, res: Response) => {
    try {
      //  using mongodb aggregation count the number of orders catgegorized by status
      const shipmentCounts = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const totalCount = await Order.find().countDocuments();

      handleSuccess(
        res,
        { ...shipmentCounts, Total: totalCount },
        "GetShipmentCounts"
      );
    } catch (error) {
      handleServerError(res, error, "GetShipmentCounts");
    }
  },

  GetShipmentDetails: async (req: CustomRequest, res: Response) => {
    try {
      const { page = 1, offset = 10, status = "" } = req.query;

      const shipmentDetails = await Order.find({ status })
        .skip(Number(offset) * (Number(page) - 1))
        .limit(Number(offset));

      handleSuccess(res, { shipmentDetails }, "GetShipmentDetails");
    } catch (error) {
      handleServerError(res, error, "GetShipmentDetails");
    }
  },
};

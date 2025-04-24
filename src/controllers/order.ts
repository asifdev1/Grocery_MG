import { Response } from "express";
import { CustomRequest } from "../middleware/index.js";
import { handleServerError, handleSuccess } from "../helpers/index.js";
import { Order } from "../models/index.js";
import moment from "moment";

export default {
  //  write a simple createOrder api with the required fields in body
  CreateOrder: async (req: CustomRequest, res: Response) => {
    try {
      const {
        customerId,
        productId,
        productName,
        supplierId,
        supplierName,
        quantity,
        price,
        deliveryDate,
      } = req.body;

      const newOrder = await Order.create({
        customerId,
        productId,
        productName,
        supplierId,
        supplierName,
        quantity,
        price,
        deliveryDate,
        status: "Pending",
        createdBy: req._id,
      });
      handleSuccess(res, { orderId: newOrder?._id }, "CreateOrder");
    } catch (error) {
      handleServerError(res, error, "CreateOrder");
    }
  },

  //  write a simple updateOrder api to update fields of an order by order_id
  UpdateOrder: async (req: CustomRequest, res: Response) => {
    try {
      const { orderId, fieldsToUpdate } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        fieldsToUpdate,
        {
          new: true,
        }
      );
      handleSuccess(res, updatedOrder, "UpdateOrder");
    } catch (error) {
      handleServerError(res, error, "UpdateOrder");
    }
  },

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
          $in: ["Pending", "In-transit"],
        },
      }).countDocuments();

      const inactiveOrders = await Order.find({
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
        status: {
          $in: ["Delivered", "Failed"],
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
      const totalCount = await Order.find().countDocuments();
      const pendingCount = await Order.find({
        status: "Pending",
      }).countDocuments();
      const completedCount = await Order.find({
        status: "Completed",
      }).countDocuments();
      const inTransitCount = await Order.find({
        status: "In-transit",
      }).countDocuments();
      const failedCount = await Order.find({
        status: "Failed",
      }).countDocuments();

      handleSuccess(
        res,
        {
          Total: totalCount,
          Pending: pendingCount,
          completed: completedCount,
          inTransit: inTransitCount,
          failed: failedCount,
        },
        "GetShipmentCounts"
      );
    } catch (error) {
      handleServerError(res, error, "GetShipmentCounts");
    }
  },

  GetShipmentDetails: async (req: CustomRequest, res: Response) => {
    try {
      const { page = 1, offset = 10, status = "" } = req.query;

      const shipmentDetails = await Order.find(status ? { status } : {})
        .skip(Number(offset) * (Number(page) - 1))
        .limit(Number(offset));

      handleSuccess(res, { shipmentDetails }, "GetShipmentDetails");
    } catch (error) {
      handleServerError(res, error, "GetShipmentDetails");
    }
  },

  GetDailyOrders: async (req: CustomRequest, res: Response) => {
    try {
      //  get order count group by dates using createdAt
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            _id: 0,
            count: 1,
          },
        },
        { $sort: { date: -1 } },
      ]);

      handleSuccess(res, dailyOrders, "GetDailyOrders");
    } catch (error) {
      handleServerError(res, error, "GetDailyOrders");
    }
  },
};

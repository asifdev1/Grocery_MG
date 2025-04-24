import express from "express";
import OrderCont from "../controllers/order.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router.route("/orders").get(middleware, OrderCont.GetOrderSummary);
router.route("/order/new").post(middleware, OrderCont.CreateOrder);
router.route("/shipment").get(middleware, OrderCont.GetShipmentCounts);
router.route("/shipmentDetails").get(middleware, OrderCont.GetShipmentDetails);
router.route("/inventory/orders").get(middleware, OrderCont.GetDailyOrders);

export default router;

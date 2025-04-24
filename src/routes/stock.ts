import express from "express";
import stockCont from "../controllers/stock.js";
import { validateProduct } from "../helpers/validators.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router
  .route("/inventory")
  .post(middleware, validateProduct, stockCont.AddStock);
router.route("/inventory/newStock").get(stockCont?.GetNewStocks);
router.route("/inventory/summary").get(stockCont?.GetStockSummary);

export default router;

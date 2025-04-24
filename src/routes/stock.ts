import express from "express";
import stockCont from "../controllers/stock.js";
import { validateProduct } from "../helpers/validators.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router
  .route("/inventory")
  .post(middleware, validateProduct, stockCont.AddStock);
router.route("/stockDetails").get(middleware, stockCont?.GetStockDetails);
router.route("/inventory/newStock").get(middleware, stockCont?.GetNewStocks);
router.route("/inventory/summary").get(middleware, stockCont?.GetStockSummary);

export default router;

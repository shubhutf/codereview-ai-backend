import express from "express";
import {
  getAllReportsByUserId,
  getFullReportByPRReportId,
  createReport
} from "../controllers/Report.controller.js";

const router = express.Router();

router.post("/create", createReport);
router.get("/AllReports",getAllReportsByUserId);
router.get("/FullReport/:id",getFullReportByPRReportId);

export default router;
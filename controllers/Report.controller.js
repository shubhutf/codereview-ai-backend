import { log } from "console";
import PRReport from "../models/PRReport.model.js"
import "dotenv/config.js"
import axios from "axios"
import { getAuth } from "@clerk/express";

export const getFullReportByPRReportId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: UserID } = getAuth(req);

if (!UserID) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

    const report = await PRReport.findOne({ _id: id, UserID })

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "PR Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllReportsByUserId = async (req, res) => {
  try {
    const { userId: UserID } = getAuth(req);

if (!UserID) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}
    const reports = await PRReport.find({ UserID })
      .sort({ createdAt: -1 })
      .select("Metadata risk_score risk_summary createdAt")

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createReport = async (req, res) => {
  try {
    const { userId: UserID } = getAuth(req);

if (!UserID) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}
    const { pr_url } = req.body;
    const pythonResponse = await axios.post(process.env.PYTHON_URL, { pr_url })
    const { issues, risk_score, risk_summary, final_summary } = pythonResponse.data
    const report = await PRReport.create({
      UserID,
      Metadata: { PRUrl: pr_url },
      Issues: issues,
      risk_score,
      risk_summary,
      final_summary
    })

    return res.status(201).json({
      success: true,
      data: report
    })
  } catch (error) {
    console.log(error.message);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

import mongoose from "mongoose";

const PageReportSchema = new mongoose.Schema({
    ReportID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PRReport",
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    Summary:{
        type:String,
        required:true
    },
    RiskScore:{
        type:Number,
        required:true
    },
    fixes:[{
        type: {
        type: String,
        enum: ["bug", "suggestion", "optimization", "security"],
        },
        description:{
            type:String,required:true
        },
        fix:{
            type:String,required:true
        },
        level:{
            type:String,enum:["low","medium","high","critical"]
        },
        metadata:{
            lineno:{
                type:Number
            }
        }
    }]
}, { timestamps: true })

PageReportSchema.index({ ReportID: 1 })

PageReport.find({ ReportID: reportId })
          .sort({ RiskScore: -1 })

const PageReport = mongoose.model('PageReport',PageReportSchema)

export default PageReport
import mongoose from "mongoose"

const PRReportSchema = mongoose.Schema({
    UserID:{
        type:String,
        required:true
    },
    Metadata:{
        PRUrl:{
            type:String,required:true
        }
    },
    Issues:[{
        file:{
            type:String,required:true
        },
        line:{
            type:Number,required:true
        },
        code:{
            type:String,required:true
        },
        issue:{
            type:String,required:true
        },
        fix:{
            type:String,required:true
        },
        type:{
            type:String,
            enum:["bug","security","performance"]
        },
        severity:{
            type:String,
            enum: ["low", "medium", "high"],
            required:true
        }
    }],
    risk_score:{
        type:Number,default:0
    },
    risk_summary:{
        type:String
    },
    final_summary:{
        type:String
    }
}, { timestamps: true })

PRReportSchema.index({ UserID: 1 })

PRReportSchema.index({ UserID: 1, createdAt: -1 })


const PRReport = mongoose.model('PRReport',PRReportSchema)

export default PRReport
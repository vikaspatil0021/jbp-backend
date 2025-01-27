import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
});

const jobSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    experience: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "EXPERT"], required: true },
    candidates: [{ type: String }],
    endDate: { type: String, required: true },
});


const Company_model = mongoose.model("Company", companySchema);
const Job_model = mongoose.model("Job", jobSchema);

export {
    Company_model,
    Job_model
}
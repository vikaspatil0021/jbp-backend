import express from "express";

import { create_job, getJobs, send_job_mails } from "../controllers/job_controller.js";

const jobs_router = express.Router();


jobs_router.post("/createjob", create_job);
jobs_router.get("/getjobs", getJobs);
jobs_router.post("/send_job_mails", send_job_mails);



export default jobs_router; 
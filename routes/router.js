import express from "express";

import auth_router from "./auth_router.js";
import jobs_router from "./job_router.js"
import authenticateUser from "../middleware/auth.js";

const router = express.Router();


router.use("/api/auth", auth_router);
router.use("/api/jobs", authenticateUser, jobs_router);

router.get("/health", (req, res) => {
    res.status(200).send({ status: "ok" })
})

export default router;

import { Job_model } from "../models/model.js";

import mail_service from "../services/node_mailer/service.js";

export const create_job = async (req, res) => {
    const { job_title, job_description, candidates, experience, end_date } = req.body;

    if (!job_title || !job_description || !candidates || !experience || !end_date) {
        return res.status(400).json({ message: "Missing fields " });
    }

    try {
        console.log(req.user.id)
        const data = new Job_model({
            company_id: req.user.id,
            jobTitle: job_title,
            jobDescription: job_description,
            experience,
            candidates,
            endDate: end_date,
        });

        await data.save();
        res.status(201).json({ message: "Job posted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong:" + err.message });
    }
};


export const getJobs = async (req, res) => {
    try {
        const data = await Job_model.find({ company_id: req.user.id });
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" + err.message });
    }
};

export const send_job_mails = async (req, res) => {
    const { jobId } = req.body;

    try {
        const data = await Job_model.findById({ _id: jobId });
        if (!data) {
            return res.status(404).json({ message: "Job not found" });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.candidates,
            subject: `Exciting Job Opportunity: ${data.jobTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                <h2 style="color: #0056b3; text-align: center;">${data.jobTitle}</h2>
                <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 16px; margin: 10px 0;">${data.jobDescription}</p>
                <p style="font-size: 16px; margin: 10px 0;">
                  <strong>Experience Level:</strong> ${data.experience}
                </p>
                <p style="font-size: 16px; margin: 10px 0;">
                  <strong>End Date:</strong> ${data.endDate}
                </p>
                <p style="font-size: 16px; margin: 10px 0; color: #555;">
                  This job was posted by your company. Don't miss this exciting opportunity!
                </p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="#" style="background-color: #0056b3; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">View Job Details</a>
                </div>
                <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 14px; text-align: center; color: #999;">
                  If you are not interested in this job, please disregard this email.
                </p>
              </div>
            `
        };


        await mail_service.sendMail(mailOptions);

        res.status(200).json({ message: "Emails sent to candidates successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" + err.message });
    }
};
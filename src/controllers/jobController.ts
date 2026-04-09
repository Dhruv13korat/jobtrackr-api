import { type Request, type Response } from 'express';
import JobApplication from '../models/jobApplication.js';
import { Op } from 'sequelize';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// CREATE - Add a new job
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await JobApplication.create({
      ...req.body,
      user_id: req.user!.id, // Injected by authenticate middleware
    });
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all jobs with Pagination & Filtering
export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Build filter object
    const whereClause: any = { user_id: req.user!.id };
    if (status) whereClause.status = status;
    if (search) {
      whereClause.company_name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    const { count, rows } = await JobApplication.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      order: [['application_date', 'DESC']],
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      jobs: rows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Edit job or change status
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const job = await JobApplication.findOne({ where: { id, user_id: req.user!.id } });

    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.update(req.body);
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a job
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await JobApplication.destroy({ where: { id, user_id: req.user!.id } });

    if (!deleted) return res.status(404).json({ message: 'Job not found' });

    res.json({ message: 'Job application deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
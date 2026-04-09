import { type Response } from 'express';
import { getResumeFeedback } from '../services/aiServices.js';

export const analyzeResume = async (req: any, res: Response) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Both resume and job description are required.' });
    }

    const feedback = await getResumeFeedback(resumeText, jobDescription);
    
    res.json({ feedback });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
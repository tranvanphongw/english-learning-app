import { Request, Response } from "express";
import mongoose from "mongoose";
import { Types } from "mongoose";
import PracticeSubmission from "../models/PracticeSubmission";
import PracticeItem from "../models/PracticeItem";
import PracticeSection from "../models/PracticeSection";
import PracticeSet from "../models/PracticeSet";
import { gradeAnswer } from "../services/practiceGrading.service";
import { AuthRequest } from "../middleware/auth";

/**
 * POST /v2/practice/sections/:sectionId/submit
 * Nộp theo Section (chuẩn cho Listening/Reading)
 * body: { userId?, answers: [{itemId, payload, timeSpentMs?}], durationSec }
 */
export async function submitPracticeSection(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    const { answers, durationSec } = req.body as {
      answers: Array<{ itemId: string; payload: any; timeSpentMs?: number }>;
      durationSec?: number;
    };

    // ✅ Xử lý userId an toàn (support cả demo_user)
    let userIdRaw = (req as any)?.user?.sub || req.body.userId;
    if (!userIdRaw) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let userId: mongoose.Types.ObjectId;
    if (mongoose.isValidObjectId(userIdRaw)) {
      userId = new mongoose.Types.ObjectId(userIdRaw);
    } else {
      // ⚙️ Nếu là user demo hoặc test offline → tạo ObjectId giả
      userId = new mongoose.Types.ObjectId();
      console.warn(`⚠️ Using mock userId for non-ObjectId value: ${userIdRaw}`);
    }

    const section = await PracticeSection.findById(sectionId).lean();
    if (!section) return res.status(404).json({ message: "Section not found" });

    const set = await PracticeSet.findById(section.setId).lean();
    if (!set) return res.status(404).json({ message: "Set not found" });

    const items = await PracticeItem.find({
      _id: { $in: answers.map((a) => a.itemId) },
    }).lean();

    const byTypeCount: Record<string, { correct: number; total: number }> = {};
    let score = 0;

    const graded = answers.map((a) => {
      const item = items.find((i) => String(i._id) === String(a.itemId));
      if (!item) {
        return {
          ...a,
          correct: false,
          expected: [],
          explanation: "Item not found",
          type: "unknown",
        };
      }

      // Auto-grade cho Listening/Reading
      let correct: boolean | null = null;
      let expectedAnswers: string[] = item.answers || [];
      
      // Convert expected answers từ chữ cái (A, B, C, D) sang text của option cho MCQ/Heading
      if ((item.type === "mcq" || item.type === "heading") && item.options) {
        expectedAnswers = (item.answers || []).map((ans: string) => {
          const normalizedAns = ans.trim().toLowerCase();
          // Nếu answer là chữ cái đơn (a, b, c, d), convert thành option text
          if (/^[a-d]$/i.test(normalizedAns)) {
            const index = normalizedAns.charCodeAt(0) - 'a'.charCodeAt(0);
            if (index >= 0 && index < item.options.length) {
              return item.options[index];
            }
          }
          // Nếu không phải chữ cái, giữ nguyên (đã là text)
          return ans;
        });
      }
      
      if (["listening", "reading", "writing"].includes(section.skill)) {
        correct = gradeAnswer(item, a.payload);
        if (correct) score++;
        const t = item.type || "unknown";
        byTypeCount[t] = byTypeCount[t] || { correct: 0, total: 0 };
        byTypeCount[t].total += 1;
        byTypeCount[t].correct += correct ? 1 : 0;
      }

      return {
        ...a,
        correct,
        expected: expectedAnswers,
        explanation: item.explanation,
        type: item.type,
      };
    });

    const total = graded.length || 1;
    const accuracy = ["listening", "reading"].includes(section.skill)
      ? +(score / total).toFixed(2)
      : null;

    const byType: Record<string, number> = {};
    Object.keys(byTypeCount).forEach((k) => {
      const v = byTypeCount[k];
      byType[k] = +(v.correct / (v.total || 1)).toFixed(2);
    });

    const sub = await PracticeSubmission.create({
      userId,
      examType: set.examType,
      skill: section.skill,
      setId: set._id,
      sectionId,
      durationSec,
      answers: graded,
      score,
      total,
      analytics: {
        accuracy: accuracy ?? undefined,
        avgTimePerItemMs:
          answers.reduce((s, a) => s + (a.timeSpentMs || 0), 0) / total,
        byType,
      },
    });

    return res.json({
      id: sub._id,
      score,
      total,
      accuracy,
      answers: graded,
      analytics: sub.analytics,
    });
  } catch (err) {
    console.error("❌ submitPracticeSection error:", err);
    res.status(500).json({ message: "Failed to submit section", error: err });
  }
}

/**
 * (Tuỳ chọn) POST /v2/practice/sets/:setId/submit
 * Nộp cả set (nếu bạn cho làm full test)
 */
export async function submitPracticeSet(req: Request, res: Response) {
  try {
    const { setId } = req.params;
    const { answers, durationSec } = req.body;

    let userIdRaw = (req as any)?.user?.sub || req.body.userId;
    if (!userIdRaw) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.isValidObjectId(userIdRaw)) {
      return res.status(400).json({
        message: "Invalid userId (must be Mongo ObjectId). Please login again.",
        userIdRaw,
      });
    }
const userId = new mongoose.Types.ObjectId(userIdRaw);
    const set = await PracticeSet.findById(setId).lean();
    if (!set) return res.status(404).json({ message: "Set not found" });

    const items = await PracticeItem.find({
      _id: { $in: answers.map((a: any) => a.itemId) },
    }).lean();

    let score = 0;
    const graded = answers.map((a: any) => {
      const item = items.find((i) => String(i._id) === String(a.itemId));
      if (!item) return { ...a, correct: false };
      const correct =
        ["listening", "reading"].includes((item as any).skill || "")
          ? gradeAnswer(item, a.payload)
          : null;
      if (correct) score++;
      return { ...a, correct };
    });

    const sub = await PracticeSubmission.create({
      userId,
      examType: set.examType,
      skill: "mixed",
      setId,
      durationSec,
      answers: graded,
      score,
      total: graded.length,
    });

    res.json({ id: sub._id, score, total: graded.length });
  } catch (err) {
    console.error("❌ submitPracticeSet error:", err);
    res.status(500).json({ message: "Failed to submit set", error: err });
  }
}

/**
 * 🧾 Lấy danh sách bài nộp (lọc theo sectionId, userId, skill)
 */
export const getSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sectionId, userId, skill } = req.query as {
      sectionId?: string;
      userId?: string;
      skill?: string;
    };

    const filter: Record<string, any> = {};
    if (sectionId) filter.sectionId = sectionId;
    if (userId) filter.userId = userId;
    if (skill) filter.skill = skill;

    const submissions = await PracticeSubmission.find(filter)
      .populate("userId", "email nickname")
      .populate("sectionId", "title skill order")
      .populate("setId", "title examType")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("❌ getSubmissions error:", err);
    res.status(500).json({ message: "Failed to fetch submissions", error: err });
  }
};

/**
 * 🔍 Lấy chi tiết một bài nộp (để chấm hoặc xem)
 */
export const getSubmissionDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const submission = await PracticeSubmission.findById(id)
      .populate("userId", "email nickname")
      .populate("sectionId", "title skill") // ✅ Thêm skill vào populate
      .populate("answers.itemId", "prompt type options answers explanation snippet");

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    res.json(submission);
  } catch (err) {
    console.error("❌ getSubmissionDetail error:", err);
    res.status(500).json({ message: "Failed to fetch submission", error: err });
  }
};

/**
 * 🔍 Lấy submission mới nhất của học viên cho một section
 * GET /v2/practice/submissions/latest?userId=xxx&sectionId=xxx
 */
export const getLatestSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, sectionId } = req.query as {
      userId?: string;
      sectionId?: string;
    };

    if (!userId || !sectionId) {
      res.status(400).json({ message: "userId and sectionId are required" });
      return;
    }

    const submission = await PracticeSubmission.findOne({
      userId,
      sectionId,
    })
      .populate("userId", "email nickname")
      .populate("sectionId", "title skill")
      .populate("answers.itemId", "prompt type options answers explanation snippet")
      .sort({ createdAt: -1 }) // Lấy mới nhất
      .lean();

    if (!submission) {
      res.status(404).json({ message: "No submission found" });
      return;
    }

    res.json(submission);
  } catch (err) {
    console.error("❌ getLatestSubmission error:", err);
    res.status(500).json({ message: "Failed to fetch latest submission", error: err });
  }
};


/**
 * 🗑️ Xóa một submission
 * DELETE /v2/practice/submissions/:id
 */
export const deleteSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const submission = await PracticeSubmission.findByIdAndDelete(id);

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    res.json({ message: "Submission deleted successfully", ok: true });
  } catch (err) {
    console.error("❌ deleteSubmission error:", err);
    res.status(500).json({ message: "Failed to delete submission", error: err });
  }
};

/**
 * GET /v2/practice/progress/me
 */
export async function getUserPracticeProgress(req: Request, res: Response) {
  try {
    const userId = (req as any)?.user?.sub || (req.query.userId as string);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rows = await PracticeSubmission.aggregate([
      { $match: { userId } },
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: "$setId",
          bestScore: { $first: "$score" },
          total: { $first: "$total" },
          lastAt: { $first: "$createdAt" },
        },
      },
      { $sort: { lastAt: -1 } },
    ]);

    res.json(rows);
  } catch (err) {
    console.error("❌ getUserPracticeProgress error:", err);
    res.status(500).json({ message: "Failed to fetch progress", error: err });
  }
}

/**
 * GET /v2/practice/sets/:setId/leaderboard
 */
export async function getPracticeLeaderboard(req: Request, res: Response) {
  try {
    const { setId } = req.params;
    const rows = await PracticeSubmission.find({ setId })
      .sort({ score: -1, durationSec: 1, createdAt: 1 })
      .limit(20)
      .lean();
    res.json(rows);
  } catch (err) {
    console.error("❌ getPracticeLeaderboard error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: err });
  }
}
/**
 *  Giáo viên chấm điểm writing/speaking
 * PUT /api/v2/practice/submissions/:id/grade
 * body: { teacherScore: number, teacherFeedback: string }
 */
export async function gradeSubmission(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { teacherScore, teacherFeedback } = req.body;
    const teacherId = req.user?.sub;

    const sub = await PracticeSubmission.findById(id);
    if (!sub) {
      return res.status(404).json({ message: "Submission not found" });
    }

    sub.teacherScore = teacherScore;
    sub.teacherFeedback = teacherFeedback;

    if (teacherId && mongoose.isValidObjectId(teacherId)) {
      sub.gradedBy = new Types.ObjectId(teacherId);
    } else {
      console.warn("⚠️ teacherId is not ObjectId, still saving score:", teacherId);
    }

    await sub.save();

    return res.json({ message: "Graded successfully", submission: sub });
  } catch (err) {
    console.error("gradeSubmission error:", err);
    return res.status(500).json({ message: "Failed to grade submission" });
  }
}


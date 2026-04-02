import { ApiConfig } from "../../config/apiConfig";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { ArrowLeft, User, FileText, CheckCircle2, XCircle, Clock, Award, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const absUrl = (u?: string) => {
  if (!u) return "";
  const base = ApiConfig.baseUrl.replace(/\/+$/, "");
  try {
    const { pathname } = new URL(u, base); // u có thể là tuyệt đối hoặc tương đối
    return `${base}${pathname}`;
  } catch {
    const path = u.startsWith("/") ? u : `/${u}`;
    return `${base}${path}`;
  }
};

interface Submission {
  _id: string;
  userId?: { email: string; nickname: string };
  sectionId?: { title: string; skill: string };
  score: number;
  total: number;
  answers: any[];
  analytics?: { accuracy?: number };
  createdAt: string;
  teacherScore?: number;
  teacherFeedback?: string;
}

const PracticeSubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`/api/v2/practice/submissions/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không tải được dữ liệu bài nộp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Đang tải dữ liệu...</h2>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">Không tìm thấy bài nộp.</p>
        </div>
      </div>
    );

  const handleGrade = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("Thiếu token! Hãy đăng nhập lại với tài khoản giáo viên.");
        return;
      }

      await axios.put(
        `/api/v2/practice/submissions/${id}/grade`,
        {
          teacherScore: data.teacherScore,
          teacherFeedback: data.teacherFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("✅ Đã lưu chấm điểm thành công");

      await fetchDetail(); // ✅ THÊM DÒNG NÀY

    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";
      message.error(`❌ Không thể lưu chấm điểm: ${msg}`);
    }
  };


  return (
    <div className="p-8">
      {/* Header với nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Quay lại</span>
      </button>

      {/* Thông tin bài nộp */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-green-100 p-3 rounded-lg">
            <User className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {data.userId?.nickname || "Học viên"}
            </h1>
            <p className="text-lg text-gray-700">{data.sectionId?.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kỹ năng</p>
              <p className="font-semibold text-gray-900 uppercase">
                {data.sectionId?.skill || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Award className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Điểm hệ thống</p>
              <p className="font-semibold text-gray-900">
                {data.score} / {data.total} ({(data.analytics?.accuracy ?? 0) * 100}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày nộp</p>
              <p className="font-semibold text-gray-900">
                {new Date(data.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          {data.teacherScore !== undefined && (
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Award className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Điểm giáo viên</p>
                <p className="font-semibold text-gray-900">{data.teacherScore}</p>
              </div>
            </div>
          )}
        </div>

        {data.teacherFeedback && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="text-blue-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Nhận xét của giáo viên:</p>
                <p className="text-blue-800">{data.teacherFeedback}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✏️ Form chấm điểm cho Writing / Speaking */}
      {["writing", "speaking"].includes(data.sectionId?.skill || "") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-green-600" size={24} />
            Chấm điểm & Nhận xét
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm (0 - 9)
              </label>
              <input
                type="number"
                min={0}
                max={9}
                step={0.5}
                value={data.teacherScore ?? ""}
                onChange={(e) =>
                  setData((prev) =>
                    prev
                      ? { ...prev, teacherScore: Number(e.target.value) }
                      : prev
                  )
                }
                className="w-full md:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét của giáo viên
              </label>
              <textarea
                rows={4}
                value={data.teacherFeedback ?? ""}
                onChange={(e) =>
                  setData((prev) =>
                    prev
                      ? { ...prev, teacherFeedback: e.target.value }
                      : prev
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical"
                placeholder="Nhập nhận xét cho học viên..."
              />
            </div>

            <button
              onClick={handleGrade}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-lg"
            >
              <Award size={18} />
              Lưu chấm điểm
            </button>
          </div>
        </div>
      )}

      {/* Danh sách câu trả lời */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="text-indigo-600" size={24} />
          Chi tiết câu trả lời
        </h2>
        
        {data.answers.map((a: any, idx: number) => {
          // Lấy kỹ năng (ưu tiên của câu, fallback của section)
          const skill =
            a.itemId?.skill?.toLowerCase?.() ||
            data.sectionId?.skill?.toLowerCase?.();

          // Lấy đường dẫn trả lời (speakingFileUrl hoặc payload)
          const raw =
            a.speakingFileUrl ||
            (typeof a.payload === "string" ? a.payload : "");

          const src = absUrl(raw);
          const isAudioFile = /\.(mp3|m4a|wav|aac|ogg|flac|webm)$/i.test(raw || "");

          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* Header với số câu và status */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  Câu {idx + 1}: {a.type?.toUpperCase?.() || "N/A"}
                </h3>
                {a.correct === true ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <CheckCircle2 size={16} />
                    Đúng
                  </span>
                ) : a.correct === false ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    <XCircle size={16} />
                    Sai
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    Chưa chấm
                  </span>
                )}
              </div>

              {/* Nội dung câu hỏi */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Đề bài</p>
                  <p className="text-gray-900">
                    {a.itemId?.prompt || a.prompt || "Không có đề bài"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Trả lời</p>
                  {(() => {
                    // 🎧 Chỉ hiển thị audio nếu là kỹ năng có âm thanh
                    if (["listening", "speaking"].includes(skill || "") && isAudioFile && src) {
                      return (
                        <audio
                          key={src}
                          controls
                          preload="metadata"
                          crossOrigin="anonymous"
                          src={src}
                          className="w-full"
                          onError={(e) =>
                            console.error("AUDIO PLAYBACK ERROR:", src, e)
                          }
                        />
                      );
                    }

                    // 📝 Các kỹ năng khác chỉ hiển thị text
                    return (
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {String(a.payload || "—")}
                      </p>
                    );
                  })()}
                </div>

                {a.expected?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Đáp án đúng</p>
                    <p className="text-green-700 font-medium bg-green-50 p-3 rounded-lg">
                      {a.expected.join(", ")}
                    </p>
                  </div>
                )}

                {a.explanation && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Giải thích</p>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {a.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PracticeSubmissionDetail;

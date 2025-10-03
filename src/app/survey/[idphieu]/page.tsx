"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import SurveyQuestion from "@/components/SurveyQuestion";
import SurveyProgress from "@/components/SurveyProgress";
import SurveyComplete from "@/components/SurveyComplete";

export default function SurveyPage() {
  const { idphieu } = useParams();
  type InfoCustomer = {
    idphieu: number;
    iddanhmuc: number;
    danhmuc: string;
    idnguoichidinh: number;
    nguoichidinh: string;
    ngaytao: string;
    idbenhnhan: number;
    tenbenhnhan: string;
    idchinhanh: number;
    tenchinhanh: string;
    thuchien: boolean;
  };
  type Question = {
    idcauhoi: number;
    anh?: string;
    noidung: string;
    giaithich?: boolean;
    note?: string;
    dapans: Array<{
      cauhoi: string;
      diem: number;
      iddapan: number;
      noidung: string;
      sudung: boolean;
    }>;
    linhvuc: number;
  };
  const [loading, setLoading] = useState(true);
  const [infoCustomer, setInfoCustomer] = useState<InfoCustomer | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [explanations, setExplanations] = useState<string[]>([]);
  const [surveyIdx, setSurveyIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: doing, 1: complete, 2: done

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://api2.315healthcare.com/api/PhieuKhaoSat/GetByIdPhieuKhaoSat/${idphieu}`
        );
        setInfoCustomer(data?.phieuKhaoSats);
        if (data?.phieuKhaoSats?.thuchien) {
          setStep(2); // đã làm đánh giá
        } else {
          // lấy câu hỏi
          const res = await axios.get(
            `https://api2.315healthcare.com/api/CauHoiKhaoSat/GetByCondition?idDanhMuc=${data?.phieuKhaoSats?.iddanhmuc}`
          );
          setQuestions(res.data);
        }
      } catch (e) {
        setStep(3); // lỗi
      }
      setLoading(false);
    }
    if (idphieu) fetchData();
  }, [idphieu]);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[surveyIdx] = value;
    setAnswers(newAnswers);
  };
  const handleExplanationChange = (text: string) => {
    const newExplanations = [...explanations];
    newExplanations[surveyIdx] = text;
    setExplanations(newExplanations);
  };
  const handleNext = async () => {
    if (surveyIdx < questions.length - 1) {
      setSurveyIdx(surveyIdx + 1);
    } else {
      // gửi kết quả
      const now = new Date().toISOString();
      const phieuKhaoSatTraLois = questions.map((q, idx) => {
        const answer = answers[idx];
        return {
          idphieu: infoCustomer?.idphieu || 0,
          idcauhoi: q.idcauhoi || null,
          iddapan: typeof answer === "number" ? answer : null,
          giaithich: explanations[idx] || "",
        };
      });
      const payload = {
        idphieu: infoCustomer?.idphieu || 0,
        idbenhnhan: infoCustomer?.idbenhnhan || 0,
        iddanhmuc: infoCustomer?.iddanhmuc || null,
        ngaytao: now,
        thuchien: true,
        idchinhanh: infoCustomer?.idchinhanh || 0,
        idnguoichidinh: infoCustomer?.idnguoichidinh || 0,
        phieuKhaoSatTraLois,
      };
      try {
        await axios.post(
          "https://api2.315healthcare.com/api/PhieuKhaoSat",
          payload
        );
        setStep(1);
      } catch (e) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (surveyIdx > 0) {
      setSurveyIdx(surveyIdx - 1);
    }
  };

  if (loading) return <div className="text-center p-8">Đang tải...</div>;
  if (step === 2)
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        đánh giá này đã được hoàn thành hoặc link không còn tồn tại.
      </div>
    );
  if (step === 3)
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        Không thể tải đánh giá. Vui lòng thử lại sau.
      </div>
    );
  if (!infoCustomer || !questions.length)
    return (
      <div className="text-center p-8">Không tìm thấy dữ liệu đánh giá.</div>
    );
  if (step === 1) return <SurveyComplete onBack={() => {}} />;

  return (
    <div className="max-w-xl mx-auto p-2">
      <div className="text-center font-bold text-lg mb-2">
        đánh giá: {infoCustomer.danhmuc}
      </div>
      <div className="text-center text-base mb-4">
        Khách hàng: {infoCustomer.tenbenhnhan}
      </div>
      <SurveyProgress
        current={surveyIdx + 1}
        total={questions.length}
        title={questions[surveyIdx]?.linhvuc?.toString() || ""}
      />
      {/* Step navigation */}
      <div className="flex justify-between items-center mb-2 px-2">
        <button
          className="text-blue-500 text-sm px-4 py-1 border border-blue-400 rounded-full disabled:opacity-50"
          onClick={handleBack}
          disabled={surveyIdx === 0}
        >
          Quay lại
        </button>
        {/* <span className="text-gray-400 text-xs">Câu {surveyIdx + 1} / {questions.length}</span> */}
        <button
          className="text-blue-500 text-sm px-4 py-1 border border-blue-400 rounded-full"
          onClick={handleNext}
        >
          {surveyIdx === questions.length - 1 ? "Hoàn thành & Nộp bài" : "Tiếp theo"}
        </button>
      </div>
      <SurveyQuestion
        giaithich={questions[surveyIdx]?.giaithich || false}
        question={questions[surveyIdx]?.noidung || ""}
        img={questions[surveyIdx]?.anh || ""}
        options={questions[surveyIdx]?.dapans || []}
        value={String(answers[surveyIdx] ?? "")}
        note={explanations[surveyIdx] ?? ""}
        onChange={handleAnswer}
        onExplanationChange={handleExplanationChange}
      />
    </div>
  );
}

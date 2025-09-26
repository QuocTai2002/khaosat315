"use client";

import React, { useEffect, useState } from "react";
// ...existing code...
import LogoHeader from "../components/LogoHeader";
import { User } from "lucide-react";
import SearchInput from "../components/SearchInput";
// import ChildList from "../components/ChildList"; // Không dùng
import CustomerInfo from "../components/CustomerInfo";
import SurveySuggestion from "../components/SurveySuggestion";
import SurveyCategory from "../components/SurveyCategory";
import SurveyProgress from "../components/SurveyProgress";
import SurveyQuestion from "../components/SurveyQuestion";
// import SurveyTextQuestion from "../components/SurveyTextQuestion"; // Không dùng
import SurveyComplete from "../components/SurveyComplete";
import axios from "axios";
import debounce from "lodash/debounce";

// const SURVEY_QUESTIONS = [...]; // Không dùng
export default function Home() {
  const [step, setStep] = useState(0); // 0: search, 1: select, 2: info, 3: survey, 4: complete
  const [questions, setQuestions] = useState<
    Array<{
      idcauhoi: number; // id câu hỏi
      anh?: string; // url hình ảnh nếu có
      noidung: string;
      dapans: Array<{
        cauhoi: string;
        diem: number;
        iddapan: number;
        noidung: string;
        sudung: boolean;
      }>;
      linhvuc: number;
    }>
  >([]);
  const [customers, setCustomers] = useState<
    Array<{
      idbn: number;
      mabenhnhan: string;
      gioitinh: string;
      ngaysinh: string;
      diachi: string;
      tenbenhnhan: string;
    }>
  >([]);
  const [infoCustomer, setInfoCustomer] = useState<{
    idbn: number;
    mabenhnhan: string;
    gioitinh: string;
    ngaysinh: string;
    diachi: string;
    tenbenhnhan: string;
  } | null>(null);
  // category
  const [category, setCategory] = useState<
    Array<{
      iddanhmuc: number;
      thangtuoi: string;
      tendanhmuc: string;
    }>
  >([]);
  // Đã bỏ biến selected không dùng

  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [surveyIdx, setSurveyIdx] = useState(0);
  const [selectedSurvey, setSelectedSurvey] = useState<
    | {
        iddanhmuc: number;
        thangtuoi: string;
        tendanhmuc: string;
      }
    | undefined
  >(undefined);

  // Handlers
  const handleSelect = (info: {
    idbn: number;
    mabenhnhan: string;
    gioitinh: string;
    ngaysinh: string;
    diachi: string;
    tenbenhnhan: string;
  }) => {
    setInfoCustomer(info);
    setStep(2);
  };
  const handleStartSurvey = () => {
    fetchSurveysByCategory(selectedSurvey?.iddanhmuc || 0);
    setStep(3);
    setSurveyIdx(0);
    setAnswers([]);
  };
  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[surveyIdx] = value;
    console.log(newAnswers);
    
    setAnswers(newAnswers);
  };

  console.log(questions);
  
  const sendSurveyResult = async () => {
    // Build payload đúng format
    const now = new Date().toISOString();
    const phieuKhaoSatTraLois = questions.map((q, idx) => {
      const answer = answers[idx];
      return {
        // idphieutraloi: 0,
        // idphieu: 0,
        idcauhoi: q.idcauhoi || 0, // lấy idcauhoi tương ứng
        iddapan: typeof answer === "number" ? answer : 0,
        giaithich: ""
      };
    });
    const payload = {
      // idphieu: 0,
      idbenhnhan: infoCustomer?.idbn || 0,
      iddanhmuc: selectedSurvey?.iddanhmuc || 0,
      ngaytao: now,
      phieuKhaoSatTraLois
    };
    try {
      await axios.post("https://api2.315healthcare.com/api/PhieuKhaoSat", payload);
    } catch (error) {
      console.log("Gửi khảo sát lỗi", error);
    }
  };

  const handleNext = () => {
    if (Array.isArray(questions) && surveyIdx < questions.length - 1) {
      setSurveyIdx(surveyIdx + 1);
    } else {
      sendSurveyResult();
      setStep(4);
    }
  };
  const handleBack = () => {
    if (surveyIdx > 0) {
      setSurveyIdx(surveyIdx - 1);
    } else {
      setStep(0);
  // setSelected(null); // Đã bỏ biến selected
    }
  };

  const searchCustomers = debounce(async (query: string) => {
    try {
      const { data } = await axios.get(
        `https://api2.315healthcare.com/api/BenhNhan/SearchBenhNhanByCT?keyword=${query}`
      );
      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  }, 300);

  // call api category
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `https://api2.315healthcare.com/api/DanhMucKhaoSat`
      );
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  // lấy danh sách khảo sát theo iddanhmuc
  const fetchSurveysByCategory = async (iddanhmuc: number) => {
    try {
      const { data } = await axios.get(
        `https://api2.315healthcare.com/api/CauHoiKhaoSat/GetByCondition?idDanhMuc=${iddanhmuc}`
      );
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="min-w-screen bg-gray-50 flex items-center justify-center">
      <div
        className="w-[800px]  bg-white rounded-2xl shadow-lg p-0 md:p-4 flex flex-col mx-auto my-auto"
        style={{ minHeight: "unset", minWidth: "unset" }}
      >
        <LogoHeader />
        {step === 0 && (
          <>
            <SearchInput onChange={searchCustomers} />
            {customers.length > 0 ? (
              <div className="mt-4 space-y-4 max-h-[500px] min-h-[500px] overflow-y-auto">
                {customers.map((customer) => (
                  <div
                    key={customer?.idbn}
                    className="cursor-pointer p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex items-center gap-2"
                    onClick={() => handleSelect(customer)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base text-gray-800 truncate">
                        {customer?.tenbenhnhan}
                      </div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 justify-between w-full">
                        <span>
                          <span className="font-medium">Mã KH:</span>{" "}
                          {customer.mabenhnhan}
                        </span>

                        <span>
                          <span className="font-medium">Ngày sinh:</span>{" "}
                          {customer.ngaysinh}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 mt-1">
                        <span className="truncate">
                          <span className="font-medium">Địa chỉ:</span>{" "}
                          {customer.diachi}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-32 mb-4 text-sm">
                Nhập họ tên để bắt đầu làm khảo sát.
              </div>
            )}
          </>
        )}
        {step === 2 && infoCustomer && (
          <>
            <CustomerInfo {...infoCustomer} />
            <div className="text-center text-gray-400 mb-2 text-sm">
              Tìm thấy 1 khách hàng
            </div>
            {selectedSurvey && (
              <SurveySuggestion
                iddanhmuc={selectedSurvey.iddanhmuc}
                thangtuoi={selectedSurvey.thangtuoi}
                tendanhmuc={selectedSurvey.tendanhmuc}
              />
            )}
            <div className="text-center font-semibold mb-2">
              Bạn đã sẵn sàng chưa?
            </div>
            <div className="flex items-center justify-center">
              <div className="flex gap-4 items-center justify-around">
                <button
                  className="text-blue-500 border border-blue-500 cursor-pointer rounded-full px-8 py-2 font-semibold mx-auto mb-4"
                  onClick={() => {
                    setStep(0);
                    setInfoCustomer(null);
                  }}
                >
                  Quay lại
                </button>
                <button
                  disabled={!selectedSurvey}
                  className="bg-blue-500 cursor-pointer text-white rounded-full px-8 py-2 font-semibold mx-auto mb-4"
                  onClick={handleStartSurvey}
                >
                  Bắt đầu
                </button>
              </div>
            </div>

            <SurveyCategory
              categories={category}
              onSelect={(value) => setSelectedSurvey(value)}
              // onSelect={(cat: { label: string }) => {
              //   if (cat.label === "+12 khảo sát") setSurveyModalOpen(true);
              //   else {
              //     const found = ALL_SURVEYS.find((s) =>
              //       s.label.includes(cat.label)
              //     );
              //     if (found) setSelectedSurvey(found);
              //   }
              // }}
            />
          </>
        )}
        {step === 3 && (
          <>
            <div className="flex justify-between items-center mb-2 px-2">
              <button className="text-blue-500 text-sm" onClick={handleBack}>
                Quay lại
              </button>
              <SurveyProgress
                current={surveyIdx + 1}
                total={Array.isArray(questions) ? questions.length : 0}
                title={questions[surveyIdx]?.linhvuc?.toString() || ""}
              />
              <button className="text-blue-500 text-sm" onClick={handleNext}>
                Tiếp theo
              </button>
            </div>
            <SurveyQuestion
              question={questions[surveyIdx]?.noidung || ""}
              img={questions[surveyIdx]?.anh || ""}
              options={questions[surveyIdx]?.dapans || []}
              value={String(answers[surveyIdx] ?? "")}
              onChange={handleAnswer}
            />
            <button
              className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mt-4"
              onClick={handleNext}
            >
              {surveyIdx === questions.length - 1 ? "Hoàn thành & Nộp bài" : "Tiếp tục"}
            </button>
          </>
        )}
        {step === 4 && (
          <>
            <SurveyComplete
              onBack={() => {
                setStep(0);
                setSelectedSurvey(undefined);
                setInfoCustomer(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

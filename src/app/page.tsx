"use client";

import React, { useEffect, useState } from "react";
// ...existing code...
import LogoHeader from "../components/LogoHeader";
import { User } from "lucide-react";
// import ChildList from "../components/ChildList"; // Không dùng
import SurveyProgress from "../components/SurveyProgress";
import SurveyQuestion from "../components/SurveyQuestion";
// import SurveyTextQuestion from "../components/SurveyTextQuestion"; // Không dùng
import SurveyComplete from "../components/SurveyComplete";
import axios from "axios";
import debounce from "lodash/debounce";
import { Button, Select } from "antd";
import dayjs from "dayjs";

interface branchList {
  idchinhanh: number;
  tenchinhanh: string;
}

interface infoCustomer {
  idphieu: number;
  iddanhmuc: number;
  tendanhmuc: string;
  idnguoichidinh: number;
  nguoichidinh: string;
  ngaytao: string;
  idbenhnhan: number;
  tenbenhnhan: string;
  idchinhanh: number;
  tenchinhanh: string;
  thuchien: boolean;
}
// const SURVEY_QUESTIONS = [...]; // Không dùng

export default function Home() {
  let branchID: string | null = null;
  if (typeof window !== "undefined") {
    branchID = localStorage.getItem("branchId");
  }
  const [step, setStep] = useState(0); // 0: search, 1: select, 2: info, 3: survey, 4: complete
  const [branchList, setBranchList] = useState<branchList[]>([]);
  const [explanations, setExplanations] = useState<string[]>([]);
  const [infoBranch, setInfoBranch] = useState<number | null>(
    Number(branchID) || null
  );
  const [questions, setQuestions] = useState<
    Array<{
      idcauhoi: number; // id câu hỏi
      anh?: string; // url hình ảnh nếu có
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
    }>
  >([]);
  const [customers, setCustomers] = useState<Array<infoCustomer>>([]);
  const [infoCustomer, setInfoCustomer] = useState<infoCustomer | null>(null);
  // Đã bỏ biến selected không dùng
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [surveyIdx, setSurveyIdx] = useState(0);

  // Handlers
  const handleSelect = (info: infoCustomer) => {
    setInfoCustomer(info);
    setStep(2);
  };
  const handleExplanationChange = (text: string) => {
    const newExplanations = [...explanations];
    newExplanations[surveyIdx] = text;
    setExplanations(newExplanations);
  };
  const handleStartSurvey = (id: number) => {
    fetchSurveysByCategory(id);
    setStep(3);
    setSurveyIdx(0);
    setAnswers([]);
    setExplanations([]);
  };
  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[surveyIdx] = value;
    setAnswers(newAnswers);
  };

  const fetchBranchList = async () => {
    try {
      const { data } = await axios.get(
        `https://api2.315healthcare.com/api/KTNhanSuCo/GetChiNhanhBaoHong`
      );
      setBranchList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendSurveyResult = async () => {
    // Build payload đúng format
    const now = new Date().toISOString();
    const phieuKhaoSatTraLois = questions.map((q, idx) => {
      const answer = answers[idx];
      return {
        // idphieutraloi: 0,
        idphieu: infoCustomer?.idphieu || 0,
        idcauhoi: q.idcauhoi || null, // lấy idcauhoi tương ứng
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
      idchinhanh: infoBranch || 0,
      idnguoichidinh: infoCustomer?.idnguoichidinh || 0,
      phieuKhaoSatTraLois,
    };
    try {
      await axios.post(
        "https://api2.315healthcare.com/api/PhieuKhaoSat",
        payload
      );
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

  const searchCustomers = debounce(async (query: number) => {
    try {
      const { data } = await axios.get(
        `https://api2.315healthcare.com/api/PhieuKhaoSat/BenhNhanChoKhaoSat?idChiNhanh=${query}`
      );
      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  }, 300);

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
    fetchBranchList();
  }, []);

  useEffect(() => {
    if (infoBranch) {
      searchCustomers(infoBranch);
    }
  }, [infoBranch]);
  return (
    <div className="min-w-screen bg-gray-50 flex items-center justify-center">
      <div
        className="w-[800px]  bg-white rounded-2xl shadow-lg p-0 md:p-4 flex flex-col mx-auto my-auto"
        style={{ minHeight: "unset", minWidth: "unset" }}
      >
        <LogoHeader />
        {step === 0 && (
          <>
            <div className="flex justify-center gap-2 ">
              <Select
                size="large"
                showSearch
                value={infoBranch}
                onChange={(value) => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("branchId", String(value));
                  }
                  setInfoBranch(value);
                }}
                options={branchList?.map((item) => ({
                  label: item.tenchinhanh,
                  value: item.idchinhanh,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                placeholder="Tìm kiếm chi nhánh"
                className="w-96"
              />
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  if (infoBranch !== null) {
                    searchCustomers(infoBranch);
                  }
                }}
              >
                Tìm
              </Button>
            </div>

            {/* <SearchInput onChange={searchCustomers} /> */}
            {customers.length > 0 ? (
              <div className="mt-4 space-y-4 max-h-[500px] min-h-[500px] overflow-y-auto">
                {customers.map((customer) => (
                  <div
                    key={customer?.idphieu}
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
                      <div className="text-gray-500 flex flex-wrap gap-x-2 justify-between w-full">
                        <span>
                          <span className="font-medium"> Ngày tạo:</span>{" "}
                          {dayjs(customer.ngaytao).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </span>

                        <span>
                          <span className="font-medium">Người tạo:</span>{" "}
                          {customer.nguoichidinh}
                        </span>
                      </div>
                      <div className=" text-gray-500 flex flex-wrap gap-x-4 mt-1">
                        <span className="truncate">
                          <span className="font-medium">Loại khảo sát:</span>{" "}
                          {customer.tendanhmuc}
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
            <div className="w-full  mx-auto bg-white rounded-lg shadow p-4 flex flex-col gap-2 mb-4">
              <div className="flex  gap-3 justify-between">
                <div>
                  <div className="text-xs text-gray-400">Khách hàng</div>
                  <div className="font-semibold text-gray-800">
                    {infoCustomer.tenbenhnhan}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Người tạo</div>
                  <div className="font-semibold text-gray-800">
                    {infoCustomer?.nguoichidinh}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Ngày tạo</div>
                  <div className="font-semibold text-gray-800">
                    {dayjs(infoCustomer?.ngaytao).format("DD/MM/YYYY HH:mm:ss")}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 flex items-center gap-4 mb-4">
              <div className="bg-blue-200 rounded-full w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-blue-700">
                  {infoCustomer.tendanhmuc}
                </div>
              </div>
            </div>
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
                  disabled={!infoCustomer}
                  className="bg-blue-500 cursor-pointer text-white rounded-full px-8 py-2 font-semibold mx-auto mb-4"
                  onClick={() => handleStartSurvey(infoCustomer.iddanhmuc)}
                >
                  Bắt đầu
                </button>
              </div>
            </div>
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
              giaithich={questions[surveyIdx]?.giaithich || false}
              question={questions[surveyIdx]?.noidung || ""}
              img={questions[surveyIdx]?.anh || ""}
              options={questions[surveyIdx]?.dapans || []}
              value={String(answers[surveyIdx] ?? "")}
              note={explanations[surveyIdx] ?? ""}
              onChange={handleAnswer}
              onExplanationChange={handleExplanationChange}
            />
            <button
              className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mt-4"
              onClick={handleNext}
            >
              {surveyIdx === questions.length - 1
                ? "Hoàn thành & Nộp bài"
                : "Tiếp tục"}
            </button>
          </>
        )}
        {step === 4 && (
          <>
            <SurveyComplete
              onBack={() => {
                setStep(0);
                setInfoCustomer(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

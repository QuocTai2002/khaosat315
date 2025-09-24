"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LogoHeader from "../components/LogoHeader";
import { User } from "lucide-react";
import SearchInput from "../components/SearchInput";
import ChildList from "../components/ChildList";
import CustomerInfo from "../components/CustomerInfo";
import SurveySuggestion from "../components/SurveySuggestion";
import SurveyCategory from "../components/SurveyCategory";
import SurveyProgress from "../components/SurveyProgress";
import SurveyQuestion from "../components/SurveyQuestion";
import SurveyTextQuestion from "../components/SurveyTextQuestion";
import SurveyComplete from "../components/SurveyComplete";


// Danh sách khách hàng mẫu (có thể mở rộng thêm trường nếu cần)
const MOCK_CUSTOMERS = [
  {
    name: "Nguyễn Văn Minh",
    code: "AB25000387",
    gender: "Nam",
    month: 2,
    birthday: "01/01/2021",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  },
  {
    name: "Nguyễn Thị Bình",
    code: "AB25000388",
    gender: "Nữ",
    month: 4,
    birthday: "01/03/2021",
    address: "234 Đường DEF, Quận 2, TP.HCM",
  },
  {
    name: "Nguyễn Hồng Linh",
    code: "AB25000389",
    gender: "Nữ",
    month: 8,
    birthday: "01/05/2021",
    address: "345 Đường GHI, Quận 3, TP.HCM",
  },
  {
    name: "Nguyễn Bằng",
    code: "AB25000390",
    gender: "Nam",
    month: 10,
    birthday: "01/07/2021",
    address: "456 Đường JKL, Quận 4, TP.HCM",
  },
  {
    name: "Nguyễn Duy Ninh",
    code: "AB25000391",
    gender: "Nam",
    month: 12,
    birthday: "01/09/2021",
    address: "567 Đường MNO, Quận 5, TP.HCM",
  },
];

const MOCK_CHILDREN = MOCK_CUSTOMERS.map((c) => c.name);


const ALL_SURVEYS = [
  { label: "Khảo sát 2 tháng", period: "0-2 tháng" },
  { label: "Khảo sát 4 tháng", period: "2-4 tháng" },
  { label: "Khảo sát 6 tháng", period: "5 tháng 0 ngày đến 6 tháng 30 ngày" },
  { label: "Khảo sát 8 tháng", period: "6-8 tháng" },
  { label: "Khảo sát 10 tháng", period: "8-10 tháng" },
  { label: "Khảo sát 12 tháng", period: "10-12 tháng" },
  { label: "Khảo sát 15 tháng", period: "12-15 tháng" },
  { label: "Khảo sát 18 tháng", period: "15-18 tháng" },
  { label: "Khảo sát 24 tháng", period: "18-24 tháng" },
  { label: "Khảo sát 36 tháng", period: "24-36 tháng" },
  { label: "Khảo sát 48 tháng", period: "36-48 tháng" },
  { label: "Khảo sát 60 tháng", period: "48-60 tháng" },
];

const SUGGESTED_SURVEY = ALL_SURVEYS[2];

const CATEGORIES = [
  { label: "2 tháng", color: "bg-blue-100 text-blue-700" },
  { label: "4 tháng", color: "bg-green-100 text-green-700" },
  { label: "8 tháng", color: "bg-orange-100 text-orange-700" },
  { label: "10 tháng", color: "bg-purple-100 text-purple-700" },
  { label: "+12 khảo sát", color: "bg-gray-100 text-gray-700" },
];

const SURVEY_QUESTIONS = [
  {
    type: "choice",
    title: "Giao tiếp",
    question:
      "Khi phát ra âm thanh, con của bạn có tạo nên những tiếng ư ư, gừ gừ hoặc những âm thanh nhỏ nhỏ khác không?",
    options: ["Có", "Thỉnh thoảng", "Chưa"],
  },
  {
    type: "text",
    title: "Câu hỏi chung",
    question:
      "Bên gia đình cha hoặc mẹ có ai bị điếc, nghe kém hoặc vấn đề về nhìn/thị giác không? Nếu có, vui lòng giải thích:",
  },
];

export default function Home() {
  const [step, setStep] = useState(0); // 0: search, 1: select, 2: info, 3: survey, 4: complete
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCustomer = React.useMemo(() =>
    MOCK_CUSTOMERS.find((c) => c.name === selected) || null,
    [selected]
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [surveyIdx, setSurveyIdx] = useState(0);
  const filtered = React.useMemo(
    () =>
      search
        ? MOCK_CHILDREN.filter((n) =>
            n.toLowerCase().includes(search.toLowerCase())
          )
        : [],
    [search]
  );
  // Modal khảo sát
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [surveySearch, setSurveySearch] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(SUGGESTED_SURVEY);
  const filteredSurveys = React.useMemo(
    () =>
      ALL_SURVEYS.filter((s) =>
        s.label.toLowerCase().includes(surveySearch.toLowerCase())
      ),
    [surveySearch]
  );

  // Reset về bước 0 nếu đang ở bước 2 mà không còn khách hàng phù hợp
  React.useEffect(() => {
    if (step === 2 && (!search.trim() || !filtered.includes(selected || ""))) {
      setStep(0);
      setSelected(null);
    }
  }, [search, filtered, step, selected]);

  // Handlers
  const handleSelect = (name: string) => {
    setSelected(name);
    setStep(2);
  };
  const handleStartSurvey = () => {
    setStep(3);
    setSurveyIdx(0);
    setAnswers([]);
  };
  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[surveyIdx] = value;
    setAnswers(newAnswers);
  };
  const handleNext = () => {
    if (surveyIdx < SURVEY_QUESTIONS.length - 1) {
      setSurveyIdx(surveyIdx + 1);
    } else {
      setStep(4);
    }
  };
  const handleBack = () => {
    if (surveyIdx > 0) {
      setSurveyIdx(surveyIdx - 1);
    } else {
      setStep(0);
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-2 py-4 md:py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-0 md:p-4 min-h-[600px] flex flex-col">
        <LogoHeader />
        {step === 0 && (
          <>
            <SearchInput value={search} onChange={setSearch} />
            {filtered.length > 0 ? (
              <div className="mt-4 space-y-4 max-h-[500px] min-h-[500px] overflow-y-auto">
                {filtered.map((name) => (
                  <div
                    key={name}
                    className="cursor-pointer p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex items-center gap-2"
                    onClick={() => handleSelect(name)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base text-gray-800 truncate">
                        {name}
                      </div>
                      {(() => {
                        const customer = MOCK_CUSTOMERS.find((c) => c.name === name);
                        return customer ? (
                          <>
                            <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 justify-between w-full">
                              <span>
                                <span className="font-medium">Mã KH:</span> {customer.code}
                              </span>
                              <span>
                                <span className="font-medium">Tuổi:</span> {customer.month} tháng
                              </span>
                              <span>
                                <span className="font-medium">Ngày sinh:</span> {customer.birthday}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 mt-1">
                              <span className="truncate">
                                <span className="font-medium">Địa chỉ:</span> {customer.address}
                              </span>
                            </div>
                          </>
                        ) : null;
                      })()}
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
        {step === 1 && (
          <>
            <SearchInput value={search} onChange={setSearch} />
            <ChildList
              childrenNames={filtered}
              onSelect={handleSelect}
              selectedName={selected}
            />
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                Không tìm thấy kết quả phù hợp.
              </div>
            ) : null}
          </>
        )}
        {step === 2 && selectedCustomer && (
          <>
            <SearchInput value={search} onChange={setSearch} />
            <CustomerInfo {...selectedCustomer} />
            <div className="text-center text-gray-400 mb-2 text-sm">
              Tìm thấy 1 khách hàng
            </div>
            <SurveySuggestion {...selectedSurvey} />
            <div className="text-center font-semibold mb-2">
              Bạn đã sẵn sàng chưa?
            </div>
            <button
              className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mb-4"
              onClick={handleStartSurvey}
            >
              Bắt đầu
            </button>
            <SurveyCategory
              categories={CATEGORIES}
              onSelect={(cat: { label: string }) => {
                if (cat.label === "+12 khảo sát") setSurveyModalOpen(true);
                else {
                  const found = ALL_SURVEYS.find((s) => s.label.includes(cat.label));
                  if (found) setSelectedSurvey(found);
                }
              }}
            />
            {/* Modal chọn khảo sát */}
            <Dialog open={surveyModalOpen} onOpenChange={setSurveyModalOpen}>
              <DialogContent className="max-w-md w-full">
                <DialogHeader>
                  <DialogTitle>Chọn khảo sát</DialogTitle>
                </DialogHeader>
                <input
                  className="w-full border rounded px-2 py-1 mb-2"
                  placeholder="Tìm kiếm khảo sát..."
                  value={surveySearch}
                  onChange={e => setSurveySearch(e.target.value)}
                  autoFocus
                />
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredSurveys.length === 0 && (
                    <div className="text-gray-400 text-sm text-center">Không có khảo sát phù hợp</div>
                  )}
                  {filteredSurveys.map((survey) => (
                    <div
                      key={survey.label}
                      className={`p-2 rounded cursor-pointer border hover:bg-blue-50 ${selectedSurvey.label === survey.label ? "border-blue-500 bg-blue-100" : "border-gray-200"}`}
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setSurveyModalOpen(false);
                      }}
                    >
                      <div className="font-semibold">{survey.label}</div>
                      <div className="text-xs text-gray-500">{survey.period}</div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
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
                total={SURVEY_QUESTIONS.length}
                title={SURVEY_QUESTIONS[surveyIdx].title}
              />
              <button className="text-blue-500 text-sm" onClick={handleNext}>
                Tiếp theo
              </button>
            </div>
            {SURVEY_QUESTIONS[surveyIdx].type === "choice" ? (
              <SurveyQuestion
                question={SURVEY_QUESTIONS[surveyIdx].question}
                options={SURVEY_QUESTIONS[surveyIdx].options ?? []}
                value={answers[surveyIdx] || ""}
                onChange={handleAnswer}
              />
            ) : (
              <SurveyTextQuestion
                question={SURVEY_QUESTIONS[surveyIdx].question}
                value={answers[surveyIdx] || ""}
                onChange={handleAnswer}
              />
            )}
            <button
              className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mt-4"
              onClick={handleNext}
            >
              Tiếp tục
            </button>
          </>
        )}
        {step === 4 && (
          <SurveyComplete onBack={() => {
            setStep(0);
            setSelected(null);
          }} />
        )}
      </div>
    </div>
  );
}

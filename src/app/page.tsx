
import React, { useState } from 'react';
import LogoHeader from '../components/LogoHeader';
import SearchInput from '../components/SearchInput';
import ChildList from '../components/ChildList';
import CustomerInfo from '../components/CustomerInfo';
import SurveySuggestion from '../components/SurveySuggestion';
import SurveyCategory from '../components/SurveyCategory';
import SurveyProgress from '../components/SurveyProgress';
import SurveyQuestion from '../components/SurveyQuestion';
import SurveyTextQuestion from '../components/SurveyTextQuestion';
import SurveyComplete from '../components/SurveyComplete';

const MOCK_CHILDREN = [
  'Nguyễn Văn Minh',
  'Nguyễn Thị Bình',
  'Nguyễn Hồng Linh',
  'Nguyễn Bằng',
  'Nguyễn Duy Ninh',
];

const MOCK_CUSTOMER = {
  name: 'Nguyễn Văn Minh',
  code: 'AB25000387',
  gender: 'Nam',
  month: 2,
};

const SUGGESTED_SURVEY = {
  label: 'Khảo sát 6 tháng',
  period: '5 tháng 0 ngày đến 6 tháng 30 ngày',
};

const CATEGORIES = [
  { label: '2 tháng', color: 'bg-blue-100 text-blue-700' },
  { label: '4 tháng', color: 'bg-green-100 text-green-700' },
  { label: '8 tháng', color: 'bg-orange-100 text-orange-700' },
  { label: '10 tháng', color: 'bg-purple-100 text-purple-700' },
  { label: '+12 khảo sát', color: 'bg-gray-100 text-gray-700' },
];

const SURVEY_QUESTIONS = [
  {
    type: 'choice',
    title: 'Giao tiếp',
    question: 'Khi phát ra âm thanh, con của bạn có tạo nên những tiếng ư ư, gừ gừ hoặc những âm thanh nhỏ nhỏ khác không?',
    options: ['Có', 'Thỉnh thoảng', 'Chưa'],
  },
  {
    type: 'text',
    title: 'Câu hỏi chung',
    question: 'Bên gia đình cha hoặc mẹ có ai bị điếc, nghe kém hoặc vấn đề về nhìn/thị giác không? Nếu có, vui lòng giải thích:',
  },
];

export default function Home() {
  const [step, setStep] = useState(0); // 0: search, 1: select, 2: info, 3: survey, 4: complete
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [surveyIdx, setSurveyIdx] = useState(0);
  const filtered = search ? MOCK_CHILDREN.filter(n => n.toLowerCase().includes(search.toLowerCase())) : [];

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
    if (surveyIdx > 0) setSurveyIdx(surveyIdx - 1);
    else setStep(2);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-2 py-4 md:py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-0 md:p-4 min-h-[600px] flex flex-col">
        <LogoHeader />
        {step === 0 && (
          <>
            <SearchInput value={search} onChange={setSearch} />
            <div className="text-center text-gray-400 mt-32 mb-4 text-sm">Nhập họ tên để bắt đầu làm khảo sát.</div>
            <button className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mt-2" disabled> Tìm kiếm </button>
          </>
        )}
        {step === 1 && (
          <>
            <SearchInput value={search} onChange={setSearch} />
            <ChildList childrenNames={filtered} onSelect={handleSelect} selectedName={selected} />
            <button className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mt-8 disabled:bg-blue-200" disabled={!selected}>Tìm kiếm</button>
          </>
        )}
        {step === 2 && (
          <>
            <SearchInput value={search} onChange={setSearch} />
            <CustomerInfo {...MOCK_CUSTOMER} />
            <div className="text-center text-gray-400 mb-2 text-sm">Tìm thấy 1 khách hàng</div>
            <SurveySuggestion {...SUGGESTED_SURVEY} />
            <div className="text-center font-semibold mb-2">Bạn đã sẵn sàng chưa?</div>
            <button className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mb-4" onClick={handleStartSurvey}>Bắt đầu</button>
            <SurveyCategory categories={CATEGORIES} onSelect={() => {}} />
          </>
        )}
        {step === 3 && (
          <>
            <div className="flex justify-between items-center mb-2 px-2">
              <button className="text-blue-500 text-sm" onClick={handleBack}>Quay lại</button>
              <SurveyProgress current={surveyIdx + 1} total={SURVEY_QUESTIONS.length} title={SURVEY_QUESTIONS[surveyIdx].title} />
              <button className="text-blue-500 text-sm" onClick={handleNext}>Tiếp theo</button>
            </div>
            {SURVEY_QUESTIONS[surveyIdx].type === 'choice' ? (
              <SurveyQuestion
                question={SURVEY_QUESTIONS[surveyIdx].question}
                options={SURVEY_QUESTIONS[surveyIdx].options ?? []}
                value={answers[surveyIdx] || ''}
                onChange={handleAnswer}
              />
            ) : (
              <SurveyTextQuestion
                question={SURVEY_QUESTIONS[surveyIdx].question}
                value={answers[surveyIdx] || ''}
                onChange={handleAnswer}
              />
            )}
            <button className="bg-blue-500 text-white rounded-full px-8 py-2 font-semibold mx-auto mt-4" onClick={handleNext}>Tiếp tục</button>
          </>
        )}
        {step === 4 && (
          <SurveyComplete />
        )}
      </div>
    </div>
  );
}

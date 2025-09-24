import React from 'react';

interface CustomerInfoProps {
  name: string;
  code: string;
  gender: string;
  month: number;
}

export default function CustomerInfo({ name, code, gender, month }: CustomerInfoProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-4 flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <div className="text-xs text-gray-400">Khách hàng</div>
          <div className="font-semibold text-gray-800">{name}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Mã BN</div>
          <div className="font-semibold text-gray-800">{code}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Giới tính</div>
          <div className="font-semibold text-gray-800">{gender}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Tháng tuổi</div>
          <div className="font-semibold text-gray-800">{month}</div>
        </div>
      </div>
    </div>
  );
}

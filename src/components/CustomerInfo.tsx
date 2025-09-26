import React from "react";

interface CustomerInfoProps {
  idbn: number;
  mabenhnhan: string;
  gioitinh: string;
  ngaysinh: string;
  diachi: string;
  tenbenhnhan: string;
}

export default function CustomerInfo({
  idbn,
  mabenhnhan,
  gioitinh,
  diachi,
  tenbenhnhan,
}: CustomerInfoProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-4 flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <div className="text-xs text-gray-400">Khách hàng</div>
          <div className="font-semibold text-gray-800">{tenbenhnhan}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Mã BN</div>
          <div className="font-semibold text-gray-800">{mabenhnhan}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Giới tính</div>
          <div className="font-semibold text-gray-800">{gioitinh}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Địa chỉ</div>
          <div className="font-semibold text-gray-800">{diachi}</div>
        </div>
      </div>
    </div>
  );
}

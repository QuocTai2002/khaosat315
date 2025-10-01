"use client";
import React from "react";
import { Modal, Button } from "antd";
import { QRCodeCanvas } from "qrcode.react";

interface SurveyQRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  surveyUrl: string;
}

const SurveyQRCodeModal: React.FC<SurveyQRCodeModalProps> = ({ visible, onClose, surveyUrl }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={320}
      bodyStyle={{ textAlign: "center", padding: 24 }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
  <QRCodeCanvas value={surveyUrl} size={200} />
        <div className="mt-2 break-all text-xs text-gray-500">{surveyUrl}</div>
        <Button
          type="primary"
          block
          onClick={() => {
            navigator.clipboard.writeText(surveyUrl);
          }}
        >
          Sao chép link khảo sát
        </Button>
      </div>
    </Modal>
  );
};

export default SurveyQRCodeModal;

import React, { useState } from "react";
import { Modal, Input, List } from "antd";

interface SurveyCategoryProps {
  categories: { iddanhmuc: number; thangtuoi: string; tendanhmuc: string }[];
  onSelect: (cat: {
    iddanhmuc: number;
    thangtuoi: string;
    tendanhmuc: string;
  }) => void;
}

const SurveyCategory: React.FC<SurveyCategoryProps> = ({
  categories,
  onSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const firstFiveCategories = categories.slice(0, 4);
  const remainingCategories = categories.slice(4);

  const filteredCategories = remainingCategories.filter((cat) =>
    cat.tendanhmuc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelect = (cat: {
    iddanhmuc: number;
    thangtuoi: string;
    tendanhmuc: string;
  }) => {
    onSelect(cat);
    handleCloseModal();
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
      {firstFiveCategories.map((cat) => (
        <button
          key={cat.iddanhmuc}
          className="px-4 border cursor-pointer hover:bg-blue-50 py-2 rounded-full text-xs font-semibold focus:outline-none"
          onClick={() => onSelect(cat)}
        >
          {cat.tendanhmuc}
        </button>
      ))}
      {remainingCategories.length > 0 && (
        <button
          className="px-4 border cursor-pointer hover:bg-blue-50 py-2 rounded-full text-xs font-semibold focus:outline-none"
          onClick={handleOpenModal}
        >
          +{remainingCategories.length} thêm
        </button>
      )}

      <Modal
        title="Chọn danh mục"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Input
          placeholder="Tìm kiếm danh mục"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <List
          dataSource={filteredCategories}
          renderItem={(cat) => (
            <List.Item
              key={cat.iddanhmuc}
              onClick={() => handleSelect(cat)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {cat.tendanhmuc}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default SurveyCategory;

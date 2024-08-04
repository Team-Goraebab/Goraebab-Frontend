'use client';

import { Card, ImageModal } from '@/components';
import { useState } from 'react';
import { SnackbarProvider } from 'notistack';

const ImagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<
    { id: string; name: string; tags: string; file: File }[]
  >([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (id: string, name: string, tags: string, file: File) => {
    setCards([...cards, { id, name, tags, file }]);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="min-h-screen flex items-center justify-center flex-col">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Open Modal
        </button>
        <p className="mt-2">Example::: 모달에서 입력한 정보를 카드에 보여줌</p>
        <div className="mt-4 max-w-4xl">
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              size={`${(card.file.size / (1024 * 1024)).toFixed(2)} MB`}
              tags={card.tags}
              status="primary"
            />
          ))}
        </div>
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
      </div>
    </SnackbarProvider>
  );
};

export default ImagePage;

import React, { useState, useEffect } from 'react';
import { FaFolderOpen, FaDocker, FaTag, FaFileSignature } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { DockerHubContent, LocalPathContent } from '@/components';
import { v4 as uuidv4 } from 'uuid';
import { showSnackbar } from '@/utils/toastUtils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, tags: string, file: File) => void;
}

const ImageModal = ({ isOpen, onClose, onSave }: ModalProps) => {
  const [activeTab, setActiveTab] = useState('local');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setName('');
      setTags('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 150) {
        showSnackbar(
          enqueueSnackbar,
          '파일 용량이 150MB를 초과했습니다.',
          'error',
          '#FF4853'
        );
        setFile(null);
      } else {
        setFile(file);
      }
    } else {
      setFile(null);
    }
  };

  // 유효성 검사
  const validateInputs = () => {
    if (!file) {
      showSnackbar(
        enqueueSnackbar,
        '이미지를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return false;
    }
    if (!name) {
      showSnackbar(enqueueSnackbar, '이름을 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    if (!tags) {
      showSnackbar(enqueueSnackbar, '태그를 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateInputs()) {
      const id = uuidv4();
      if (file) {
        onSave(id, name, tags, file);
      }
      onClose();
      // 값 초기화
      setActiveTab('local');
      setName('');
      setTags('');
      // 성공 토스트 메시지
      showSnackbar(
        enqueueSnackbar,
        `${file?.name}을 저장했습니다`,
        'success',
        '#4C48FF'
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'local':
        return (
          <LocalPathContent
            onFileChange={handleFileChange}
            file={file}
            onClose={onClose}
          />
        );
      case 'docker':
        return <DockerHubContent />;
      default:
        return null;
    }
  };

  const handleCloseBtn = () => {
    onClose();
    setActiveTab('local');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl mx-4 md:mx-0 h-full md:h-4/5 flex flex-col shadow-lg overflow-hidden">
        <button
          onClick={handleCloseBtn}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-center">
          <span className="text-blue-500">이미지</span>
          <span className="text-black">를 불러올 방식을 선택하세요.</span>
        </h2>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center px-4 py-2 mr-2 ${
              activeTab === 'local'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded shadow`}
          >
            <FaFolderOpen className="mr-2" />
            Local Path
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center px-4 py-2 ${
              activeTab === 'docker'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded shadow`}
          >
            <FaDocker className="mr-2" />
            Docker Hub
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center overflow-auto">
          {renderTabContent()}
        </div>
        <div className="mt-2 space-y-2">
          <div className="relative">
            <FaFileSignature className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaTag className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="태그 (쉼표로 구분)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

'use client';

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import {
  FaTimesCircle,
  FaInfoCircle,
  FaPencilAlt,
  FaPlusCircle, FaChevronUp, FaChevronDown,
} from 'react-icons/fa';
import { Container, ThemeColor, VolumeData } from '@/types/type';
import ImageDetailModal from '@/components/modal/image/imageDetailModal';
import ContainerNameModal from '../modal/container/containerNameModal';
import SelectVolumeModal from '../modal/volume/selectVolumeModal';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
}

interface ImageInfo {
  name: string;
  tag: string;
}

interface ImageToNetwork {
  name: string;
  tag: string;
  networkName: string;
}

const CardContainer = ({
                         networkName,
                         networkIp,
                         containers,
                         themeColor,
                         onDelete,
                         onSelectNetwork,
                         isSelected,
                       }: CardContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [droppedImages, setDroppedImages] = useState<ImageInfo[]>([]);
  const [imageToNetwork, setImageToNetwork] = useState<ImageToNetwork[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [containerName, setContainerName] = useState<string>('container name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<VolumeData[]>([]);
  const [imageVolumes, setImageVolumes] = useState<{
    [network: string]: { [imageKey: string]: VolumeData[] };
  }>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const splitImageNameAndTag = (image: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { name, tag };
  };

  const handleGetInfo = async (imageName: string) => {
    try {
      const imageDetail = await fetch(
        `/api/image/detail?name=${imageName}`,
      ).then((res) => res.json());
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: { image: string }) => {
      const imageInfo = splitImageNameAndTag(item.image);
      setDroppedImages((prev) => [...prev, imageInfo]);
      setImageToNetwork((prev) => [...prev, { ...imageInfo, networkName }]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const allImages = [
    ...containers.map((c) => splitImageNameAndTag(c.image.name)),
    ...droppedImages,
  ];


  const handleDeleteImage = (index: number) => {
    const imageToDelete = droppedImages[index];
    const imageKey = `${imageToDelete.name}:${imageToDelete.tag}`;

    // 이미지 삭제
    setDroppedImages((prev) => prev.filter((_, i) => i !== index));

    // imageToNetwork에서 해당 이미지 정보 삭제
    setImageToNetwork((prev) =>
      prev.filter(
        (entry) =>
          !(
            entry.name === imageToDelete.name &&
            entry.tag === imageToDelete.tag &&
            entry.networkName === networkName
          ),
      ),
    );

    // imageVolumes에서 해당 이미지의 볼륨 데이터 삭제
    setImageVolumes((prev) => {
      const updatedVolumes = { ...prev };
      if (
        updatedVolumes[networkName] &&
        updatedVolumes[networkName][imageKey]
      ) {
        delete updatedVolumes[networkName][imageKey];
        // 만약 해당 네트워크에 더 이상 볼륨 정보가 없다면 네트워크 키도 삭제
        if (Object.keys(updatedVolumes[networkName]).length === 0) {
          delete updatedVolumes[networkName];
        }
      }
      return updatedVolumes;
    });
  };

  const handleOpenNameModal = () => {
    setIsNameModalOpen(true);
  };

  const handleSaveName = (newName: string) => {
    setContainerName(newName);
    setIsNameModalOpen(false);
  };

  const handleOpenVolumeModal = (imageName: string) => {
    setSelectedImage(imageName);
    setImageVolumes((prev) => ({
      ...prev,
      [networkName]: {
        ...prev[networkName],
        [imageName]: prev[networkName]?.[imageName] || [],
      },
    }));
    setSelectedVolumes(imageVolumes[networkName]?.[imageName] || []);
    setIsVolumeModalOpen(true);
  };

  const handleCloseVolumeModal = () => {
    setIsVolumeModalOpen(false);
  };

  const handleAddVolume = (volumeData: VolumeData[]) => {
    setImageVolumes((prev) => ({
      ...prev,
      [networkName]: {
        ...prev[networkName],
        [selectedImage]: volumeData,
      },
    }));
    handleCloseVolumeModal();
  };

  return (
    <>
      <div
        className={`absolute flex items-center text-xs font-semibold border-2 h-6 px-3 py-4 rounded-t-lg content-center`}
        style={{
          top: '-2.14rem',
          left: '1.25rem',
          zIndex: '10',
          borderColor: `${themeColor.borderColor}`,
          color: `${themeColor.textColor}`,
          backgroundColor: `${themeColor.bgColor}`,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenNameModal();
          }}
        >
          <FaPencilAlt
            className="w-4 h-4 mr-1"
            style={{ color: themeColor.borderColor }}
          />
        </button>
        {containerName}
      </div>
      <div
        ref={ref}
        className={`relative flex flex-col items-center p-6 border bg-white rounded-lg shadow-lg w-[500px] transition-colors duration-200 cursor-pointer ${
          isOver ? 'bg-grey_1' : ''
        }`}
        style={{
          borderColor: isSelected ? themeColor.textColor : '',
          borderWidth: isSelected ? '2px' : '',
        }}
        onClick={onSelectNetwork}
      >
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="absolute top-4 right-4 hover:text-gray-500 text-white duration-200 hover:scale-105"
          >
            <FaTimesCircle
              className="w-5 h-5 text-white"
              style={{ color: themeColor.borderColor, backgroundColor: 'white', borderRadius: 10 }}
            />
          </button>
        )}

        <div
          className="w-full text-center text-blue_6 border-2 p-3 rounded-md mb-4 text-sm font-semibold"
          style={{
            borderColor: `${themeColor.borderColor}`,
            backgroundColor: `${themeColor.bgColor}`,
            color: `${themeColor.textColor}`,
          }}
        >
          {`${networkName} : ${networkIp}`}
        </div>
        <div className="w-full max-h-[400px] scrollbar-hide overflow-y-auto">
          {allImages.length > 0 ? (
            <div className="space-y-4">
              {allImages.map((image, index) => {
                const imageKey = `${image.name}:${image.tag}`;
                const isExpanded = expandedImage === imageKey;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-row items-center gap-2">
                          <span className="font-bold font-pretendard">{image.name}</span>
                          <span
                            className="px-2 py-1 text-xs font-semibold rounded-md inline-block"
                            style={{
                              borderColor: `${themeColor.borderColor}`,
                              backgroundColor: `${themeColor.bgColor}`,
                              color: `${themeColor.textColor}`,
                            }}
                          >
                    {image.tag}
                  </span>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <button
                            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetInfo(imageKey);
                            }}
                          >
                            <FaInfoCircle className="w-4 h-4" />
                            <span>정보</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenVolumeModal(imageKey);
                            }}
                          >
                            <FaPlusCircle className="w-4 h-4" />
                            <span>볼륨 추가</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 text-sm text-red-500 hover:text-red_6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(index);
                            }}
                          >
                            <FaTimesCircle className="w-4 h-4" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                      {imageVolumes[networkName]?.[imageKey] && (
                        <div className="mt-3 flex justify-end">
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setExpandedImage(isExpanded ? null : imageKey)}
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      )}
                    </div>
                    {isExpanded && imageVolumes[networkName]?.[imageKey] && (
                      <div className="bg-gray-50 p-4 rounded-b-lg border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Volumes
                          ({imageVolumes[networkName][imageKey].length})</h4>
                        <ul className="space-y-2">
                          {imageVolumes[networkName][imageKey].map((vol, volIndex) => (
                            <li key={volIndex} className="flex items-center justify-between">
                      <span
                        className="text-sm text-gray-600 truncate max-w-[300px]"
                        title={vol.Name}
                      >
                        {vol.Name}
                      </span>
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {vol.Driver}
                      </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="w-full h-36 flex items-center justify-center text-grey_7 p-2 text-sm border-2 border-dashed border-gray-300 rounded-lg">
              이미지를 드래그해서 놓으세요
            </div>
          )}
        </div>
      </div>
      <ContainerNameModal
        open={isNameModalOpen}
        containerName={containerName}
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveName}
        onChange={(name) => setContainerName(name)}
      />
      <ImageDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
      <SelectVolumeModal
        open={isVolumeModalOpen}
        imageName={selectedImage}
        onClose={handleCloseVolumeModal}
        onSave={handleAddVolume}
        initialSelectedVolumes={selectedVolumes}
      />
    </>
  );
};

export default CardContainer;

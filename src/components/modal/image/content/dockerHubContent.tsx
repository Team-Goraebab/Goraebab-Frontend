import React, { useState } from 'react';
import { FaStar, FaDownload } from 'react-icons/fa';
import fetchDockerHubImages from './fetchDockerHubImages';

const DockerHubContent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const results = await fetchDockerHubImages(query);
    setImages(results);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg w-full h-full p-6">
      <div className="flex w-full mb-4">
        <input
          type="text"
          placeholder="이미지를 검색하세요"
          className="border border-gray-300 rounded-l w-full p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-r shadow hover:bg-blue-600 focus:outline-none text-nowrap"
        >
          검색
        </button>
      </div>
      {loading && <p className="mt-4">이미지 검색 중...</p>}
      <div className="mt-4 w-full h-64 overflow-y-auto scrollbar-hide">
        {images.length > 0
          ? images.map((image) => (
              <div
                key={image.id}
                className="border border-gray-300 rounded p-4 mb-4 flex items-center"
              >
                <div className="flex-grow">
                  <p className="font-bold text-lg">{image.repo_name}</p>
                  <p className="text-sm text-gray-600">
                    {image.short_description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-gray-500">
                  <div className="flex items-center mb-2">
                    <FaStar className="mr-1 text-yellow-500" />
                    <span>{image.star_count}</span>
                  </div>
                  <div className="flex items-center">
                    <FaDownload className="mr-1 text-blue-500" />
                    <span>{image.pull_count}</span>
                  </div>
                </div>
              </div>
            ))
          : !loading && <p className="text-gray-500">검색 결과가 없습니다.</p>}
      </div>
    </div>
  );
};

export default DockerHubContent;

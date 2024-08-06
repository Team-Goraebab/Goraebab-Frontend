import React from 'react';

interface Container {
  name: string;
  ip: string;
  status: string;
}

export interface CardContainerProps {
  networkIp: string;
  containers: Container[];
}

const CardContainer = ({ networkIp, containers }: CardContainerProps) => {
  return (
    <div className="flex flex-col items-center p-[10px] border bg-white border-grey_3 rounded-lg shadow-lg w-[450px]">
      <div className="w-full text-center bg-blue_1 text-blue_2 border-2 border-blue_2 p-2 rounded-md mb-3 text-sm font-semibold">
        {`docker0 : ${networkIp}`}
      </div>
      {containers.length > 0 ? (
        <div className="w-full max-h-52 overflow-y-auto scrollbar-hide">
          {containers.map((container, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 mb-2 border rounded-md bg-gray-50"
            >
              <span>{container.name}</span>
              <div className="flex items-center space-x-4">
                <span>{container.ip}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    container.status === 'running'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CardContainer;

import React from 'react';
import { CardContainer, ConnectBar, HostCard } from '@/components';
import { CardContainerProps } from './cardContainer';
import { HostCardProps } from './hostCard';

interface CardSectionProps {
  hostData: HostCardProps;
  containerData: CardContainerProps;
}

const CardSection = ({ hostData, containerData }: CardSectionProps) => {
  return (
    <>
      <div className="flex space-x-0">
        <HostCard
          hostNm={hostData.hostNm}
          ip={hostData.ip}
          status={hostData.status}
        />
        <ConnectBar />
        <CardContainer networkIp={containerData.networkIp} />
      </div>
    </>
  );
};

export default CardSection;

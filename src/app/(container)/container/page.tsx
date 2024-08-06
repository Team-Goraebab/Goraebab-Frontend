'use client';

import React from 'react';
import { CardContainer, ConnectBar, HostCard } from '@/components';
import { HOST_DATA, NETWORK_DATA } from '@/data/mock';

const ContainerPage = () => {
  return (
    <div className="flex space-x-0">
      <HostCard
        hostNm={HOST_DATA.hostNm}
        ip={HOST_DATA.ip}
        status={HOST_DATA.status}
      />
      <ConnectBar />
      <CardContainer
        networkIp={NETWORK_DATA.networkIp}
        containers={NETWORK_DATA.containers}
      />
    </div>
  );
};

export default ContainerPage;

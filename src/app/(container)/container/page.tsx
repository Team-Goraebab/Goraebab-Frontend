'use client';

import React from 'react';
import { HOST_DATA, NETWORK_DATA } from '@/data/mock';
import CardSection from '@/components/card/cardSection';

const ContainerPage = () => {
  return (
    <>
      <CardSection hostData={HOST_DATA} containerData={NETWORK_DATA} />
    </>
  );
};

export default ContainerPage;

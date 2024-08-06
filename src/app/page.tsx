import React from 'react';
import ImagePage from './(image)/image/page';
import ContainerPage from './(container)/container/page';
import { HOST_DATA, NETWORK_DATA } from '@/data/mock';

export default function Page() {
  return (
    <div>
      <ImagePage />
      <ContainerPage />
    </div>
  );
}

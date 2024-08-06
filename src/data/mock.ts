export const IMAGE_CARD_DATA = [
  {
    id: 'sha-image',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'success',
  },
  {
    id: 'sha-24546wdjnas930m-gkdlxkduwldk',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'success',
  },
  {
    id: 'suyoooi-24546wdjnas930m',
    size: '1.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
  {
    id: 'suyoooi-24546wdjnas930m',
    size: '1.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
  {
    id: 'suyoooi-123123container',
    size: '1.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
];

export const CONTAINER_CARD_DATA = [
  {
    id: 'sha-container',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
  {
    id: 'sha-24546wdjnas930m-gkdlxkduwldk',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
];

export const NETWORK_CARD_DATA = [
  {
    id: 'sha-network',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
  {
    id: 'sha-24546network930m-network',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
];

export const VOLUME_CARD_DATA = [
  {
    id: 'volume',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
  {
    id: 'sha-24546network930m-network',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'success',
  },
];

export const HOST_DATA = {
  hostNm: 'Host Name',
  ip: '12.34.56.67',
  status: true,
};

export const NETWORK_DATA = {
  networkIp: '172.17.0.1',
  containers: [
    { name: 'naver-backend', ip: '172.17.0.2', status: 'running' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'stopped' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'running' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'stopped' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'running' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'stopped' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'stopped' },
    { name: 'naver-frontend', ip: '172.17.0.3', status: 'stopped' },
  ],
};

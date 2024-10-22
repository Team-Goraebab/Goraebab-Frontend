import axios from 'axios';

export const createDockerClient = (hostIp?: string | null) => {
  const effectiveHost =
    hostIp === null || hostIp === undefined
      ? sessionStorage.getItem('selectedHostIp') || 'localhost'
      : hostIp;

  console.log('effectiveHost >>>', effectiveHost);

  // IP 주소와 포트를 정규식으로 파싱
  const ipPortRegex = /^((?:\d{1,3}\.){3}\d{1,3})(?::(\d+))?$/;
  const match = effectiveHost.match(ipPortRegex);

  let host = effectiveHost;
  let port = '2375';

  if (match) {
    host = match[1];  // IP 주소 부분
    port = match[2] || '2375';  // 포트 부분 (없으면 기본값 2375)
  }

  const isLocalhost = host === 'localhost' || host === '127.0.0.1';

  const options = isLocalhost
    ? {
      baseURL: 'http://localhost',
      socketPath: '/var/run/docker.sock',
    }
    : {
      baseURL: `http://${host}:${port}`,
    };

  console.log('Docker client options:', options);
  return axios.create(options);
};

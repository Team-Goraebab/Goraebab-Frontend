import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '@/app/api/axiosInstance';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hostIp = searchParams.get('hostIp') || 'localhost';

  try {
    const dockerClient = createDockerClient(hostIp);
    console.log('Attempting to connect to Docker host:', hostIp);

    const response = await dockerClient.get('/images/json');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message
        || error.message
        || 'Failed to connect to Docker daemon';

      console.error('Detailed error:', {
        message: errorMessage,
        code: error.code,
        response: error.response?.data,
      });

      return NextResponse.json(
        { error: errorMessage },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}

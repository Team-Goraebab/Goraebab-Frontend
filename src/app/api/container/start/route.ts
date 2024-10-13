import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing container id' },
      { status: 400 }
    );
  }

  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.post(`/containers/${id}/start`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error starting the container:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to start the container' },
      { status: 500 }
    );
  }
}
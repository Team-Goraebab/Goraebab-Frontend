import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://hub.docker.com/v2/search/repositories`,
      {
        params: { query },
      }
    );
    return NextResponse.json(response.data.results, { status: 200 });
  } catch (error) {
    console.error('Error fetching Docker Hub images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Docker Hub images' },
      { status: 500 }
    );
  }
}

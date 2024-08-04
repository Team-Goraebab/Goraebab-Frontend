import axios from 'axios';

const FetchDockerHubImages = async (query: string) => {
  try {
    const response = await axios.get('/api/dockerHubSearch', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Docker Hub images:', error);
    return [];
  }
};

export default FetchDockerHubImages;

import { RecommendTestData } from "@/types/RecommenTests/Recommend";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const recommendTest = async (data: RecommendTestData) => {
  try {
    const response = await fetch(`${baseUrl}/counsellor/recommend_test.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error recommending test:', error);
    throw error;
  }
};
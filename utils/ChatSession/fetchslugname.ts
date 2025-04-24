import { TestResponse } from "@/types/RecommenTests/Recommend";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchTestSlugs = async (): Promise<TestResponse> => {
  try {
    const response = await fetch(`${baseUrl}/tests/get_all_tests.php`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test slugs:', error);
    throw error;
  }
};
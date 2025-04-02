import axios from 'axios'
import { CounselorProfileData } from '@/types/profile/profile'

const fetchProfile = async (): Promise<CounselorProfileData | null> => {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL
        const api = `${BASE_URL}/counsellor/get_counsellor_details.php?counsellorId=c123456`
        const response = await axios.get<CounselorProfileData>(api);
        
        return response.data;
    } catch (error) {
        console.log(`Error Fetching Data`, error);
        return null;
    }
}

export default fetchProfile;
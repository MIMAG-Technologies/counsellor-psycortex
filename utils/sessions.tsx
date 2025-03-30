

import axios from 'axios'
const BASE_URL=process.env.NEXT_PUBLIC_API_URL;


export const fetchSessions=async()=>{
    try {
        const api=`${BASE_URL}/cousnellor/get_counsellor_sessions.php?cousnellorId=c13456&mode=video&status=completed&page=1&limit=10`
        const response=await axios.get(api);
        return response.data;
    } catch (error) {

        console.error('Error Fetching Data:',error)
        return null;
        
    }
}
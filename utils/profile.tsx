import axios from 'axios'
const fetchProfile=async()=>{
    try {
        const BASE_URL=process.env.NEXT_PUBLIC_API_URL
        const api=`${BASE_URL}/counsellor/get_counsellor_details.php?counsellorId=c123456`
        const response=await axios.get(api);

        if(response.data.success){
            return response.data.data;
        }

        return [];
    } catch (error) {
        console.log(`Error Fetching Data`,error);
    }
}

export default fetchProfile;
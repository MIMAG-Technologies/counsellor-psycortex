

import axios from "axios";
const base_url = process.env.NEXT_PUBLIC_API_URL
export const verify=async(counsellorId:string)=>{
    try {
        const response = await axios.get(`${base_url}/meet/auth_verify.php?counsellor_id=${counsellorId}`);
        if(response.data.auth_status==="not_authenticated"){
            return false
        }
        return true
    } catch (error) {
        console.log("Error verifying counsellor:", error);
        return false
    }
}
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const MarkManagement = async({counsellorId, chatId}: { counsellorId: string; chatId: string })=>{
    try {
        await axios.post(
            `${baseUrl}/sessions/mark_chat_session_actions.php`,{
                "counsellorId": counsellorId,
                
  "actions": [
    {
      "type": "complete",
      "session_id":  chatId,
      "userJoined": true
    }
  ]
            }
        )
    } catch (error) {
        console.log(error);
        return false;

    }
}
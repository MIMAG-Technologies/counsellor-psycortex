export async function uploadFile(file: File, sessionId: string, senderId: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chat_session_id', sessionId);
  formData.append('sender_id', senderId);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/upload_file.php`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to upload file');
    }

    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
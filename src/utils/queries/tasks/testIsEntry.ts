import axios from 'axios'; // Импортируем библиотеку для выполнения HTTP-запросов

export const checkChannelMembership = async (userId) => {

    //console.log(import.meta.env.VITE_SECRET_BOT_TOKEN)
    const chatId = '@fitton_online';
    const botToken = import.meta.env.VITE_SECRET_BOT_TOKEN;

    try {
        const response = await axios.get(`https://api.telegram.org/bot${botToken}/getChatMember`, {
            params: {
                chat_id: chatId,
                user_id: userId
            }
        });

        const chatMemberStatus = response.data.result.status;

        return chatMemberStatus === 'member' || chatMemberStatus === 'administrator' || chatMemberStatus === 'creator';
    } catch (error) {
        console.error('Error checking channel membership:', error);
        return false;
    }
};



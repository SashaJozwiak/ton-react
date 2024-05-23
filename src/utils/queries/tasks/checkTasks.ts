import { checkChannelMembership } from "./testIsEntry"


export const checkWallet = async (userId: number, taskId: number) => {
    const isWallet = await checkChannelMembership(userId)

    if (isWallet) {
        try {
            console.log(userId, taskId)
            await fetch('https://fitton.online/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, taskId }),
            });

        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('User is don\'t have wallet')
    }
}

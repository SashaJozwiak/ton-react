import { checkChannelMembership } from "./testIsEntry";

export const checkWallet = async (
    userId: number,
    taskId: number,
    userFriendlyAddress: string,
    setRoutes: (arg0: string) => void
) => {
    if (userFriendlyAddress) {
        try {
            console.log(userId, taskId)
            const response = await fetch('https://fitton.online/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, taskId }),
            });
            const result = await response.json();
            console.log('Response from server:', result);
        } catch (error) {
            console.log(error);
        } 
    } else {
        console.log('User is don\'t have wallet')
        setRoutes('profile')
    }
};

export const checkSubscription = async (
    userId: number,
    taskId: number,
) => {
    try {
        const isMember = await checkChannelMembership(userId);
        if (isMember) {
            console.log('subscribed')
            try {
                console.log('subscribed in trycatch')
                const response = await fetch('https://fitton.online/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, taskId }),
                });
                const result = await response.json();
                console.log('Response from server:', result);
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('no subscribed')
            //window.open('https://t.me/fitton_online', '_blank');
            const openLink = (url) => {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.click();
            };

            // Используйте openLink вместо window.open
            openLink('https://t.me/fitton_online');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

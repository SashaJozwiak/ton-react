import { getTeamId } from "../teams/getTeams";
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
        console.log(isMember);
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
            /* window.open('https://t.me/fitton_online', '_blank'); */
            window.location.href = 'https://t.me/fitton_online';
           /*  const openLink = (url: string) => {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.click();
            };

            openLink('https://t.me/fitton_online'); */
            console.log('no subscribed after link')
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export const checkTeams = async (
    userId: number,
    taskId: number,
    setRoutes: (arg0: string) => void
) => {
    const teamId = await getTeamId(userId);
    if (teamId) {
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
        setRoutes('teams');
    }
};

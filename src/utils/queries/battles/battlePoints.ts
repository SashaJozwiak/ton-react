export const getBattlesDataFn = async (userId: number) => {
    try {
        const response = await fetch(`https://fitton.online/battles?userId=${userId}`);
        const battlesData = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //const { user_id, ...onLifeBalance } = balance;
        console.log(battlesData)
        return battlesData;
    } catch (err) {
        console.log(err);
    }
};

export const battlePoints = async (
    userId: number,
    taskId: number,
) => {
    try {
        console.log('user id adn task id: ', userId, taskId);
        const response = await fetch('https://fitton.online/battles', {
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
};

//sets date and kiks

export const setKicks = async (userId: number, value: number) => {
    try {
        const response = await fetch('https://fitton.online/battles/setKicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, value }),
        });
        const result = await response.json();
        console.log('Response from server:', result);
    } catch (error) {
        console.log(error)
    }
};


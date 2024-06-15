export const getBalance = async (userId: number) => {
    try {
        const response = await fetch(`https://fitton.online/balance?userId=${userId}`);
        const balance = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user_id, ...onLifeBalance } = balance;
        //console.log('get onbalance: ', onLifeBalance)
        return onLifeBalance;
    } catch (err) {
        console.log(err);
    }
}

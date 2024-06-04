export const getTeams = async () => {
    try {
        const response = await fetch('https://fitton.online/teams');
        const result = await response.json();
        return result;
    } catch (e) {
        console.log('fetch teams errror: ', e);
    }
}

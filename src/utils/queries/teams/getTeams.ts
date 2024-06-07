export const getTeams = async () => {
    try {
        const response = await fetch('https://fitton.online/teams');
        const result = await response.json();
        return result;
    } catch (e) {
        console.log('fetch teams errror: ', e);
    }
}

export const getTeamId = async (userId: number) => {
    try {
        const response = await fetch(`https://fitton.online/teams/getMyTeam?userId=${userId}`);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log('fetch teams errror: ', e);
    }
}

export const getAllScores = async () => {
    try {
        const response = await fetch('https://fitton.online/teams/scores');
        const result = await response.json();
        console.log('result!:  ', result);

        return result;
    } catch (e) {
        console.log('fetch scores errror:  ', e);
    }
}

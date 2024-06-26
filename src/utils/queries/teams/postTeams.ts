export const inOutTeam = async (userId: string, teamId: number, inOut: string) => {

    try {
        const response = await fetch('https://fitton.online/teams/inout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, teamId, inOut }),
        });
        const result = await response.json();
        console.log(result);
        //return result;
    } catch (e) {
        console.log('fetch teams errror: ', e);
    }
}

export const createTeam = async (userId: string, teamName: string) => {
    try {
        const response = await fetch('https://fitton.online/teams/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, teamName }),
        });

        const result = await response.json();
        console.log(result);

    } catch (e) {
        console.log('fetch teams errror:  ', e);
    }
}

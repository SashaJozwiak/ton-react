
export async function refreshAccessToken(refreshToken: string, userId: number) {
    console.log(refreshToken)
    try {
        await fetch(`http://localhost:3000/refreshToken?refreshToken=${refreshToken}&userId=${userId}`);

    } catch (error) {
        console.log(error)
        throw error;
    }
}

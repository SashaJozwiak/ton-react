export async function refreshAccessToken(refreshToken: string, userId: number) {
    console.log(refreshToken)
    try {
        const newAccess = await fetch(`http://localhost:3000/refreshToken?refreshToken=${refreshToken}&userId=${userId}`);
        const newAccessData = await newAccess.json();
        console.log(newAccessData);
        return newAccessData;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

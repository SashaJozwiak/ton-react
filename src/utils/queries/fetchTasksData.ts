export const getATasks = async (userId: number) => {
    try {
        const response = await fetch(`https://www.fitton.online/tasks?userId=${userId}`);
        const tasks = await response.json();
        return tasks;
    } catch (err) {
        console.log(err);
    }
}

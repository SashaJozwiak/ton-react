export const getATasks = async (userId: number) => {
    try {
        const response = await fetch(`http://localhost:3000/tasks?userId=${userId}`);
        const tasks = await response.json();
        return tasks;
    } catch (err) {
        console.log(err);
    }
}

import React, { useEffect } from 'react'
import { getATasks } from '../../utils/queries/fetchTasksData';

interface ITasks {
    task_id: number;
    task_name: string;
    task_price: number;
    status: string;
}

const Tasks = ({ userId }) => {
    const [tasks, setTasks] = React.useState<ITasks[]>([]);

    const fetchTasks = async () => {
        try {
            const tasksData = await getATasks(userId);
            setTasks(tasksData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    return (
        <div>
            {tasks.map((task) => {
                return (
                    <div key={task.task_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '1rem', padding: '0.25rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                        <h4>{task.task_name}</h4>
                        <p>{task.task_price}</p>
                        <p>{task.status}</p>
                    </div>
                )
            })}
        </div >
    )
}

export default Tasks

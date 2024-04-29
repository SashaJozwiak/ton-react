import React, { useEffect } from 'react'
import { getATasks } from '../../utils/queries/fetchTasksData';

interface ITasks {
    task_id: number;
    task_name: string;
    task_price: number;
    status: string;
}

const Tasks = ({ userId }) => {
    //const [tasks, setTasks] = React.useState<ITasks[]>([]);

    const [completeTasks, setCompleteTasks] = React.useState<ITasks[]>([]);
    const [uncompleteTasks, setUncompleteTasks] = React.useState<ITasks[]>([]);

    const fetchTasks = async () => {
        try {
            const tasksData = await getATasks(userId);
            setCompleteTasks(tasksData.filter((task: ITasks) => task.status === 'true'));
            setUncompleteTasks(tasksData.filter((task: ITasks) => task.status === 'false'));
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    console.log('complete: ', completeTasks);
    console.log('uncomplete: ', uncompleteTasks);
    return (
        <div>
            {uncompleteTasks.map((task) => {
                return (
                    <div key={task.task_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '1rem', padding: '1rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                        <h3>{task.task_name}</h3>
                        <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                        >+{task.task_price}</h3>
                    </div>
                )
            })}
            <h2>Complete:</h2>
            {completeTasks.map((task) => {
                return (
                    <div key={task.task_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '1rem', padding: '1rem', borderRadius: '0.25rem', background: 'rgba(80, 80, 80, 0.3)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px', color: 'gray' }}>
                        <p>{task.task_name}</p>
                        <p>{task.task_price}</p>
                    </div>
                )
            })}
        </div >
    )
}

export default Tasks

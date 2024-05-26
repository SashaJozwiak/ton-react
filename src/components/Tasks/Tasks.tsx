import React, { useEffect } from 'react'
import { useTonAddress } from '@tonconnect/ui-react';

import { getATasks } from '../../utils/queries/fetchTasksData';
import { checkSubscription, checkWallet } from '../../utils/queries/tasks/checkTasks';

interface ITasks {
    task_id: number;
    task_name: string;
    task_price: number;
    status: string;
}

const Tasks = ({ userId, setRoutes }) => {
    const userFriendlyAddress = useTonAddress();

    const [completeTasks, setCompleteTasks] = React.useState<ITasks[]>([]);
    const [uncompleteTasks, setUncompleteTasks] = React.useState<ITasks[]>([]);
    const [rerender, setRerender] = React.useState<boolean>(false);

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
    }, [userId, rerender])

    const checkTask = async (taskId: number) => {
        console.log('taskId: ', taskId);
        switch (taskId) {
            case 1:
                await checkWallet(userId, taskId, userFriendlyAddress, setRoutes);
                break;
            case 2:
                console.log('check subscription id2');
                await checkSubscription(userId, taskId);
                break;
            default:
                console.log('no task id');
        }
        await fetchTasks()
        setRerender(!rerender);
    }

    return (
        <div>
            {uncompleteTasks.map((task) => {
                return (
                    <button key={task.task_id}
                        onClick={() => checkTask(task.task_id)}
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '85vw', margin: '1rem auto', padding: '1rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px', cursor: 'pointer' }}>
                        <h3>{task.task_name}</h3>
                        <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                        >+{task.task_price}</h3>
                    </button>
                )
            })}
            <h2>Complete:</h2>
            {completeTasks.map((task) => {
                return (
                    <div key={task.task_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '1rem auto', width: '90vw', padding: '1rem', borderRadius: '0.25rem', background: 'rgba(80, 80, 80, 0.3)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px', color: 'gray' }}>
                        <p>{task.task_name}</p>
                        <p>{task.task_price}</p>
                    </div>
                )
            })}
        </div >
    )
}

export default Tasks

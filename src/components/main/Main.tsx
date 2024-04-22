
import { useEffect, useState } from 'react';
import { AuthData } from '../../App';
import { getSteps } from '../Go/goUtils';

interface MainProps {
    userId: number;
    authData: AuthData | null;
}

export const Main: React.FC<MainProps> = ({ userId, authData }) => {

    const [steps, setSteps] = useState();

    //console.log(authData.id)

    async function fetchDataFromGoogleFit(token: string) {
        try {
            await getSteps(token, setSteps)
        } catch (error) {
            console.error('Error fetching user data from Google Fit:', error);
        }
    }

    useEffect(() => {
        if (authData !== null) {
            console.log(authData.access_token)
            fetchDataFromGoogleFit(authData.access_token)
        }
    }, [authData])

    return (
        <div>
            <h1>Hello World</h1>
            <p>main: {userId}</p>
            {!userId && <p>не получил userId</p>}

            {authData && <pre>id:{authData.id}</pre>}

            {steps && <p>steps: {steps}</p>}
            <p>====</p>

        </div>
    )
}

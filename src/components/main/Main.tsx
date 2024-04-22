
import { AuthData } from '../../App';

interface MainProps {
    userId: number;
    authData: AuthData;
}

export const Main: React.FC<MainProps> = ({ userId, authData }) => {

    console.log(authData.id)
    return (
        <div>
            <h1>Hello World</h1>
            <p>main: {userId}</p>
            {!userId && <p>не получил userId</p>}

            {authData && <pre>{authData.id}</pre>}

            <p>====</p>
        </div>
    )
}

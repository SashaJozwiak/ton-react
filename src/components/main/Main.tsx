
interface MainProps {
    userId: number | string;
}

export const Main: React.FC<MainProps> = ({ userId }) => {


    return (
        <div>
            <h1>Hello World</h1>
            <p>main: {userId}</p>
        </div>

    )
}

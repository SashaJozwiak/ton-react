import { useEffect, useState } from "react";

interface TimerProps {
    lastBattleDate: number;
}

const Timer: React.FC<TimerProps> = ({ lastBattleDate }) => {
    const [timeLeft, setTimeLeft] = useState<number>(/* 24 * 60 * 60 * 1000 */0);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentDate = Date.now();
            const differentTime = currentDate - lastBattleDate;
            const timeRemaining = 12 * 60 * 60 * 1000 - differentTime; // 24 hours - elapsed time

            if (timeRemaining <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
            } else {
                setTimeLeft(timeRemaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lastBattleDate]);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <>
            <div style={{ opacity: '1.2', color: 'black' }}>
                {hours.toString().padStart(2, '0')}:
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
            </div>
        </>
    );
};

export default Timer;

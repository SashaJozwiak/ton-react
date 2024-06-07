import { ActivityData } from '../queries/fetchData';

export function sumPointsFn(
    activData: ActivityData,
    setSumPoints: (sumPoints: number) => void,
    onLifeBalance: Record<string, number>
): void {
    console.log('calc summ: ', activData, onLifeBalance)
    const sum = +(((activData.steps + activData.calories + (activData.cardio * 100)) / 1000).toFixed(3)) || 0.000;
    const sumFinallyLife = sum > 10000 ? sum.toFixed(0) : sum;

    const sumFinallyOnline = (onLifeBalance.battles +
        onLifeBalance.frens + onLifeBalance.tasks) / 100;

    setSumPoints((+sumFinallyLife) + sumFinallyOnline || 0.000);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateLvl(data: any, value: number, setProgress: any) {
    for (let i = 0; i < data.length; i++) {
        if (
            value >= data[i].need &&
            (i === data.length - 1 || value < data[i + 1].need)
        ) {
            setProgress({
                current_lvl: data[i].lvl,
                current_points: value,
                start_lvl: data[i].need,
                next_lvl: data[i + 1] ? data[i + 1].need : null,
            });
        }
    }
    return null;
}

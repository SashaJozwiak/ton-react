import { ActivityData } from '../queries/fetchData';

export function sumPointsFn(activData: ActivityData, setSumPoints: (sumPoints: number) => void) {
    const sum = +(((activData.steps + activData.calories + (activData.cardio * 1000)) / 1000).toFixed(3)) || 0.000;
    setSumPoints(sum)
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

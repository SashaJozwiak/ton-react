import { ActivityData } from "../queries/fetchData";

export function calcEnemy(activeData: ActivityData, lvl: number) {

    console.log('activeData', activeData);

    const cardio = activeData.cardio;
    const Kcal = activeData.calories;
    const steps = activeData.steps;

    const enemyLevel = Math.floor(Math.random() * ((lvl + 2) - (lvl - 1) + 1) + (lvl - 1));
    console.log(enemyLevel);

    const cardioMax = cardio + (cardio * 0.1)
    const cardioMin = cardio - (cardio * 0.1)

    const KcalMax = Kcal + (Kcal * 0.1)
    const KcalMin = Kcal - (Kcal * 0.1)

    const stepsMax = steps + (steps * 0.1)
    const stepsMin = steps - (steps * 0.1)

    const enemyCardio = Math.floor(Math.random() * (cardioMax - cardioMin + 1)) + cardioMin;
    console.log('enemyCardio', enemyCardio.toFixed());

    const enemyKcal = Math.floor(Math.random() * (KcalMax - KcalMin + 1)) + KcalMin;
    console.log('enemyKcal', enemyKcal.toFixed());

    const enemySteps = Math.floor(Math.random() * (stepsMax - stepsMin + 1)) + stepsMin;
    console.log('enemySteps', enemySteps.toFixed());

    return {
        level: enemyLevel,
        cardio: +enemyCardio.toFixed(),
        calories: +enemyKcal.toFixed(),
        steps: +enemySteps.toFixed()
    };
}

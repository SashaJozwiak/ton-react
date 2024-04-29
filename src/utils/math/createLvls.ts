interface lvl {
    lvl: number;
    add: number;
    need: number;
}

const sum: number = 99;
const arr: Array<lvl> = [];
for (let i = 0; i <= sum; i++) {
    const obj: lvl = {
        lvl: i,
        add: i === 0 ? 0 : +(i * 0.2 + 3.321).toFixed(3),
        need: i === 0 ? 0 : +(i * 0.2 + 3.321).toFixed(3),
    };
    arr.push(obj);
}

console.log(arr);

function calculateLvl(data: Array<lvl>, value: number) {
    for (let i = 0; i < data.length; i++) {
        if (
            value >= data[i].need &&
            (i === data.length - 1 || value < data[i + 1].need)
        ) {
            return {
                current_lvl: data[i].lvl,
                current_points: value,
                start_lvl: data[i].need,
                next_lvl: data[i + 1].need,
            };
        }
    }
    return null;
}

console.log(calculateLvl(arr, 3.424));

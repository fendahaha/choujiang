let arr = [1, 2, 3, 4];

function shift(arr) {
    const random = (n) => Math.floor(Math.random() * n)
    for (let i = arr.length - 1; i > 0; --i) {
        let randomIndex = random(i + 1);
        let temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

let result = [];
for (let i = 0; i < 100000; i++) {
    result.push(shift(arr)[0])
}
let r = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
}
for (let i = 0; i < result.length; i++) {
    if (result[i] === 1) {
        r['1'] = r['1'] + 1
    }
    if (result[i] === 2) {
        r['2'] = r['2'] + 1
    }
    if (result[i] === 3) {
        r['3'] = r['3'] + 1
    }
    if (result[i] === 4) {
        r['4'] = r['4'] + 1
    }
}
console.log(r['1'] / result.length, r['2'] / result.length, r['3'] / result.length, r['4'] / result.length);
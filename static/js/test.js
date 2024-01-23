let arr = [1, 2, 3, 4];

function count_result(result) {
    let r = arr.map(i => 0);
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (result[i] === arr[j]) {
                r[j] += 1;
            }
        }
    }
    console.log(r.map(i => i / result.length).join("    "));
}

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

function test1(n = 100000) {
    let result = [];
    for (let i = 0; i < n; i++) {
        result.push(shift(arr)[0])
    }
    count_result(result);
}

// test1();

function test2(n = 100000) {
    let result = [];
    for (let i = 0; i < n; i++) {
        result.push(arr[Math.floor(Math.random() * 4)])
    }
    count_result(result);
}

// test2(1000);


function d() {
    let r = [];
    for (let i = 0; i < 100; i++) {
        r.push(Math.floor(Math.random() * 4))
    }
    let f = r.reduce((prev, curr) => prev + curr)
    return f / r.length
}

function test3(n = 10) {
    let result = [];
    for (let i = 0; i < n; i++) {

        result.push(arr[Math.round(d())])
        // result.push(arr[Math.floor(Math.random() * 4)])
    }
    count_result(result);
}
test3()





function shuffle(arr) {
    const random = (n) => Math.floor(Math.random() * n)
    for (let i = arr.length - 1; i > 0; --i) {
        let randomIndex = random(i + 1);
        let temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

/**#############################*/
const clear_data = () => {
    let data = false;
    $.ajax({
        url: '/api.php?action=clear_data',
        data: null,
        async: false,
        dataType: 'json',
        success: function (d) {
            data = d;
        },
    });
    return data;
}

const get_prizes = () => {
    let data = [];
    $.ajax({
        url: '/api.php?action=prizes',
        data: null,
        async: false,
        dataType: 'json',
        success: function (d) {
            data = d;
        },
    });
    return data;
}

const get_persons = () => {
    let data = [];
    $.ajax({
        url: '/api.php?action=persons',
        data: null,
        async: false,
        dataType: 'json',
        success: function (d) {
            data = d;
        },
    });
    return shuffle(data);
}

const save_hit_the_jackpot = (prizes) => {
    const _prizes = prizes.map(p => p).reverse();
    let data = false;
    $.ajax({
        url: '/api.php?action=hit_the_jackpot',
        method: 'POST',
        data: {prizes_json_str: JSON.stringify(_prizes)},
        async: false,
        dataType: 'json',
        success: function (d) {
            data = d;
        },
    });
    return data;
}
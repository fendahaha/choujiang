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
    return data;
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
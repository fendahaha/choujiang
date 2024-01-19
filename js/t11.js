const prize_util = {
    prizes: {
        '1': {id: '1', name: '奖品1', total: 1, winners: []},
        '2': {id: '2', name: '奖品2', total: 3, winners: []},
        '3': {id: '3', name: '奖品3', total: 5, winners: []},
        '4': {id: '4', name: '奖品4', total: 10, winners: []},
    },
    current_prize_id: null,
    choose_prize: (prize_id) => {
        let curr = this.prizes[prize_id];
        if (curr.total > curr.winners.length) {
            alert("此项奖品已抽完")
            return false
        }
        this.current_prize_id = prize_id;
        return true
    },
    hit_the_jackpot: (person) => {
        let curr = this.prizes[this.current_prize_id];
        curr.winners.push(person)
        return true
    }
}
/**############################*/
const buttons_manager = {
    hideAll: () => {
        $(".buttons > button").hide()
    },
    hide: (...ids) => {
        ids.forEach(e => $(`#${e}`).hide())
    },
    show: function (...ids) {
        this.hideAll();
        ids.forEach(e => $(`#${e}`).show())
    }
}
/**############################*/
const cards = [...Array(119).keys()];
const cards_html = cards.map((i) => {
    return `<div class="card" id="card-${i}">
                <div class="card-back"></div>
                <div class="card-front">
                    <div class="card-front-1">LG</div>
                    <div class="card-front-2">${i}</div>
                    <div class="card-front-3">251900006</div>
                </div>
            </div>`
}).join('');
$(".cards .card").remove();
$(".cards").append(cards_html);
/**############################*/
const rectangular_matrix = {
    get_card_translate_xy: (index) => {
        let xn = (index % 17 - 8) * (100 + 20);
        let yn = (Math.floor(index / 17) - 3) * (126 + 20);
        return {xn, yn}
    },
    get_card_translate3D: function (index) {
        const {xn, yn} = this.get_card_translate_xy(index);
        return `translate3d(${xn}px, ${yn}px, 0)`
    },
    do: function () {
        cards.forEach(i => {
            const {xn, yn} = rectangular_matrix.get_card_translate_xy(i);
            $("#card-" + i).css('transform', `translate3d(${xn}px, ${yn}px, 0) rotateY(0deg)`)
        })
    }
}
const random_place_animation_manager = {
    loading: false,
    animations: [],
    random_point_around_container: () => {
        const rate = 2;
        let w = Math.floor(Math.random() * window.innerWidth) - window.innerWidth / 2;
        let h = Math.floor(Math.random() * window.innerHeight) - window.innerHeight / 2;
        return {x: w * rate, y: h * rate}
    },
    do: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            const _animations = cards.map(i => {
                const translate3D = rectangular_matrix.get_card_translate3D(i);
                const {x, y} = _this.random_point_around_container();
                const z = Math.floor(Math.random() * 500) - 250;
                const target = $("#card-" + i)[0];
                const keyframes = [
                    {transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(360deg)`, offset: 0},
                    {transform: `${translate3D} rotateY(0deg)`, offset: 1},
                ];
                const options = {
                    fill: "forwards",
                    easing: "ease-in",
                    duration: (Math.random() + 1) * 1000,
                    iterations: 1,
                };
                const animate = target.animate(keyframes, options);
                return animate.finished
            })
            this.animations = _animations
            return Promise.all(_animations).then(() => {
                this.loading = false;
            })
        }
    },
    finished: function () {
        return Promise.all(this.animations)
    },
}
const card_flip_animation = {
    loading: false,
    animations: [],
    flip_back: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            $(".cards .card").addClass('two-face');
            const animations = cards.map(i => {
                const translate3D = rectangular_matrix.get_card_translate3D(i);
                const keyframes = [{transform: `${translate3D} rotateY(180deg)`}];
                const options = {fill: "forwards", easing: "ease-in", duration: 500, iterations: 1,};
                const animate = $(`#card-${i}`)[0].animate(keyframes, options);
                return animate.finished.then((a) => {
                    a.commitStyles()
                })
            })
            this.animations = animations;
            return Promise.all(animations).then(() => {
                _this.loading = false;
            })
        }
    },
    flip_front: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            const animations = cards.map(i => {
                const translate3D = rectangular_matrix.get_card_translate3D(i);
                const keyframes = [{transform: `${translate3D} rotateY(0deg)`}];
                const options = {fill: "forwards", easing: "ease-in", duration: 500, iterations: 1,};
                const animate = $(`#card-${i}`)[0].animate(keyframes, options);
                return animate.finished.then((a) => {
                    a.commitStyles()
                })
            })
            this.animations = animations;
            return Promise.all(animations).then(() => {
                $(".cards .card").removeClass('two-face');
                _this.loading = false;
            })
        }
    },
    finished: function () {
        return Promise.all(this.animations)
    }
}

// rectangular_matrix.do();
// random_place_animation_manager.do()

$(".cards .card").css('transform-origin', 'center center -800px')
let rotateXY_list = [];
[...Array(24).keys()].forEach(i => {
    let y = i * 15;
    let x_arr = [...Array(6).keys()].map((i) => i + 1).map((i) => 90 - 25.7 * i)
    if (i % 2 === 1) {
        x_arr.shift()
        x_arr.pop()
    }
    let xy = x_arr.map(x => {
        return {x: x, y: y}
    })
    rotateXY_list.push(...xy)
})

console.log(rotateXY_list);
cards.forEach((i, index) => {
    let xy = rotateXY_list[index]
    $(`#card-${i}`).css('transform', `translate3d(0, 0, 800px) rotateY(${xy.y}deg) rotateX(${xy.x}deg)`)
})

$("#loading").on('click', () => {
    const keyframes = [
        {transform: `translate3d(0, 0, 800px) rotateY(${0}deg) rotateX(${0}deg)`, offset: 1},
    ];
    const options = {fill: "forwards", easing: "ease-in", duration: 1000, iterations: 1};
    const animate = $(`#card-${40}`)[0].animate(keyframes, options);
});
$("#go_to_lottery").on('click', () => {
    const keyframes = [
        {transform: `translate3d(0, 0, -1750px) rotateY(360deg)`, offset: 0},
        {transform: `translate3d(0, 0, -1750px) rotateY(0deg)`, offset: 1},
    ];
    const options = {fill: "forwards", easing: "ease-in", duration: 3000, iterations: 1};
    const animate = $(`.cards`)[0].animate(keyframes, options);
});
$("#start_lottery").on('click', () => {
    card_flip_animation.flip_front()
});
$("#quit_lottery").on('click', () => {

});
$("#stop_lottery").on('click', () => {
});
$("#confirm_lottery").on('click', () => {
});
/**############################*/
/**############################*/
/**############################*/
/**############################*/


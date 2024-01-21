const prizes = [
    {id: '1', name: '奖品1', total: 1, winners: []},
    {id: '2', name: '奖品2', total: 3, winners: []},
    {id: '3', name: '奖品3', total: 5, winners: []},
    {id: '4', name: '奖品4', total: 10, winners: []},
    {id: '5', name: '奖品5', total: 10, winners: []},
    {id: '6', name: '奖品6', total: 10, winners: []},
    {id: '7', name: '奖品7', total: 10, winners: []},
    {id: '8', name: '奖品8', total: 10, winners: []},
];
const bcr = $(".prizes-container-content0")[0].getBoundingClientRect();
const prize_util = {
    current_prize_index: 0,
    last_animation: null,
    curr_deg: 0,
    per_deg: 360 / prizes.length,
    prize_finished: function (index) {
        index = index ? index : this.current_prize_index;
        const prize = prizes[index];
        if (prize.total <= prize.winners.length) {
            return true
        }
        return false
    },
    choose_prize: function (index) {
        if (this.last_animation) {
            this.last_animation.cancel();
        }
        this.current_prize_index = index;
        let curr = prizes[index];
        $(".prize").css('filter', 'blur(20px)');
        $(`#prize-${curr.id}`).css('filter', 'blur(0px)');
        const keyframes = [
            {filter: `blur(20px)`, offset: 0},
            {filter: `blur(0px)`, offset: 1},
        ];
        const options = {
            fill: "forwards", easing: "ease-in", duration: 400, iterations: 1,
        };
        this.last_animation = $(`#prize-${curr.id}`)[0].animate(keyframes, options);
        return true
    },
    hit_the_jackpot: function (person) {
        const prize = prizes[this.current_prize_index];
        prize.winners.push(person);
        const progress = (prize.winners.length / prize.total) * 100;
        $(`#prize-${prize.id}`).find('.progress').css('width', `${progress}%`);
        $(`#prize-${prize.id}`).find('.number').text(`${prize.winners.length}/${prize.total}`);
        return true
    },
    $prizes_target: $(".prizes"),
    render: function () {
        const html = prizes.map((prize, index) => {
            const progress = prize.winners.length / prize.total;
            const rotateX = index * this.per_deg;
            return `<div class="prize" id="prize-${prize.id}" style="transform: rotateX(${rotateX}deg)">
                    <div class="left">
                        <img src="http://lottery.xsmng.com/img/mbp.jpg" alt="prize" class="icon"/>
                    </div>
                    <div class="right">
                        <div class="name">${prize.name}</div>
                        <div class="count">
                            <div class="progress" style="width:${progress}%;"></div>
                            <span class="number">${prize.winners.length}/${prize.total}</span>
                        </div>
                    </div>
                </div>`
        }).join('');
        this.$prizes_target.empty().append(html);
        this.choose_prize(this.current_prize_index);
        $(".prize_choose_buttons").removeClass('hide');
    },
    choose_next: function () {
        let next_index = (this.current_prize_index + 1) % prizes.length;
        this.choose_prize(next_index);

        this.curr_deg -= this.per_deg;
        const keyframes = [
            {transform: `rotateX(${this.curr_deg}deg)`, offset: 1},
        ];
        const options = {
            fill: "forwards", easing: "ease-in", duration: 400, iterations: 1,
        };
        return this.$prizes_target[0].animate(keyframes, options)
            .finished.then((a) => {
                a.commitStyles()
            });
    },
    choose_prev: function () {
        let next_index = this.current_prize_index - 1;
        if (next_index === -1) {
            next_index = prizes.length - 1;
        }
        this.choose_prize(next_index);

        this.curr_deg += this.per_deg;
        const keyframes = [
            {transform: `rotateX(${this.curr_deg}deg)`, offset: 1},
        ];
        const options = {
            fill: "forwards", easing: "ease-in", duration: 400, iterations: 1,
        };
        return this.$prizes_target[0].animate(keyframes, options)
            .finished.then((a) => {
                a.commitStyles()
            });
    },
    translateY: bcr.top - 10,
    prize_winners_height: window.innerHeight - bcr.height - 10,
    show_winners: function () {
        console.log(window.innerHeight - bcr.height - 10);
        const winners = prizes[this.current_prize_index].winners;
        let html = winners.map((w, i) => {
            return `<div class="prize-winner">
                        <div class="department">${w.department}</div>
                        <div class="name">${w.name}</div>
                        <div class="employeeId">${w.employeeId}</div>
                    </div>`
        }).join('');
        // html = [...Array(20).keys()].map(e => {
        //     return `<div class="prize-winner">
        //                 <div class="department">dadad</div>
        //                 <div class="name">dasd</div>
        //                 <div class="employeeId">q3142424234</div>
        //             </div>`
        // }).join('');
        $(".prize-winners-content").empty().append(html);
        $(".prize-winners").show().css('height', this.prize_winners_height);
    },
    hide_winners: function () {
        $(".prize-winners-content").empty();
        $(".prize-winners").hide();
    },
    disable: function () {
        $(".prize_choose_buttons").addClass('hide');
        $(".prizes-container-content0").css('overflow', 'hidden');
        const keyframes = [
            {transform: `translateY(0px)`, offset: 0},
            {transform: `translateY(-${this.translateY}px)`, offset: 1},
        ];
        const options = {
            fill: "forwards", easing: "ease-in", duration: 600, iterations: 1,
        };
        return $(".prizes-container-content")[0].animate(keyframes, options).finished.then(() => {
            this.show_winners()
        })
    },
    enable: function () {
        this.hide_winners();
        const keyframes = [
            {transform: `translateY(-${this.translateY}px)`, offset: 0},
            {transform: `translateY(0px)`, offset: 1},
        ];
        const options = {
            fill: "forwards", easing: "ease-in", duration: 600, iterations: 1,
        };
        return $(".prizes-container-content")[0].animate(keyframes, options).finished.then(() => {
            $(".prize_choose_buttons").removeClass('hide');
            $(".prizes-container-content0").css('overflow', 'visible');
        })
    }
}
$(".prize_choose_next").on('click', () => {
    prize_util.choose_next()
})
$(".prize_choose_prev").on('click', () => {
    prize_util.choose_prev();
})
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
    },
    show_loading: function () {
        this.show('loading')
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
const persons = [...Array(130).keys()].map(e => {
    return {
        id: `p-${e}`,
        name: `p-${e}`,
        employeeId: '251900006',
        department: '研发',
        style: `background-color: rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10});`
    }
});
const persons_show = persons.slice(0, cards.length);
const persons_hide = persons.slice(cards.length);
const person_manager = {
    upload: function () {
        const _this = this;
        persons_show.forEach((person, index) => {
            _this.update(index, person)
        })
    },
    update: function (index, person) {
        const $target = $(`#card-${index}`);
        $target.attr('person-id', person.id);
        $target.find('.card-front-1').text(person.department)
        $target.find('.card-front-2').text(person.name)
        $target.find('.card-front-3').text(person.employeeId)
    },
    swap: function (show_index, hide_index) {
        this.update(show_index, persons_hide[hide_index]);
        let temp = persons_show[show_index];
        persons_show[show_index] = persons_hide[hide_index];
        persons_hide[hide_index] = temp;
    },
    show: function (person) {
        return this.last_animation_finished.then(() => {
            if ($(`[person-id=${person.id}]`).length === 0) {
                let hide_index = null;
                persons_hide.forEach((p, i) => {
                    if (p.id === person.id) {
                        hide_index = i;
                    }
                });
                let show_index = Math.floor(Math.random() * persons_show.length);
                this.swap(show_index, hide_index);
            }
        })
    },
    interval_id: null,
    last_animation: null,
    last_animation_finished: Promise.resolve(true),
    do_animate: function (show_index) {
        const keyframes = [
            // {backgroundColor: `rgba(255, 255, 0, 0.4)`, offset: 0},
            {backgroundColor: `rgba(0, 127, 127, 1)`, offset: 0},
            {backgroundColor: `rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10})`, offset: 1},
        ];
        const options = {fill: "forwards", duration: 600, iterations: 1};
        this.last_animation_finished = $(`#card-${show_index}`).find('.card-front')[0]
            .animate(keyframes, options).finished.then((a) => {
                a.commitStyles()
            });
    },
    updating: function () {
        const _this = this;
        this.interval_id = setInterval(() => {
            let show_index = Math.floor(Math.random() * persons_show.length);
            let hide_index = Math.floor(Math.random() * persons_hide.length);
            _this.swap(show_index, hide_index);
            if (!$(`#card-${show_index}`).hasClass('highlight')) {
                _this.do_animate(show_index);
            }
            return this
        }, 100)
    },
    stop_updating: function () {
        clearInterval(this.interval_id);
        return this
    },
};
const word_2023 = {
    get_cards: () => {
        const arr1 = [18, 19, 20, 37, 52, 53, 54, 69, 86, 87, 88];
        const arr2 = [22, 23, 24, 39, 41, 56, 58, 73, 75, 90, 91, 92];
        const arr3 = [26, 27, 28, 45, 60, 61, 62, 77, 94, 95, 96];
        const arr4 = [30, 31, 32, 49, 66, 65, 64, 83, 100, 99, 98];
        return [...arr1, ...arr2, ...arr3, ...arr4]
    },
    init: function () {
        this.get_cards().forEach((v, i) => {
            $(`#card-${v}`).addClass('highlight')
        })
        return this
    },
    cancel: function () {
        this.get_cards().forEach((v, i) => {
            $(`#card-${v}`).removeClass('highlight')
        })
        return this
    },
    show: function () {
        this.get_cards().forEach((v, i) => {
            $(`#card-${v}`).addClass('show_highlight')
        })
    },
    hide: function () {
        this.get_cards().forEach((v, i) => {
            $(`#card-${v}`).removeClass('show_highlight')
        })
    },
}
person_manager.upload();
/**############################*/
const rectangular_animation = {
    get_card_translate_xy: (index) => {
        let xn = (index % 17 - 8) * (100 + 20);
        let yn = (Math.floor(index / 17) - 3) * (126 + 20);
        return {xn, yn}
    },
    get_card_transform: function (index) {
        const {xn, yn} = this.get_card_translate_xy(index);
        const translate = `translate3d(${xn}px, ${yn}px, 0)`;
        const rotate = 'rotateY(0deg) rotateX(0deg)';
        return {translate, rotate}
    },
    do_no_animate: function () {
        const _this = this;
        cards.forEach(i => {
            const {translate, rotate} = _this.get_card_transform(i);
            $("#card-" + i).css('transform', `${translate} ${rotate}`);
        })
    },
    do: function (options = {fill: "forwards", easing: "ease-in-out", duration: 1000, iterations: 1}) {
        const _this = this;
        const animations = cards.map((i, index) => {
            const {translate, rotate} = _this.get_card_transform(i)
            const keyframes = [{transform: `${translate} ${rotate}`, offset: 1}];
            return $(`#card-${i}`)[0].animate(keyframes, options).finished.then((a) => {
                a.commitStyles()
            })
        });
        return Promise.all(animations)
    }
}
const random_place_animation = {
    loading: false,
    finished: Promise.resolve(true),
    random_point_around_container: () => {
        const rate = 2;
        let w = Math.floor(Math.random() * window.innerWidth) - window.innerWidth / 2;
        let h = Math.floor(Math.random() * window.innerHeight) - window.innerHeight / 2;
        return {x: w * rate, y: h * rate}
    },
    random_transform: function () {
        const {x, y} = this.random_point_around_container();
        const z = Math.floor(Math.random() * 2000) - 1000;
        const translate = `translate3d(${x}px, ${y}px, ${z}px)`;
        const rotate = 'rotateY(360deg) rotateX(0deg)';
        return {translate, rotate}
    },
    do: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            const animations = cards.map(i => {
                const card_transform = rectangular_animation.get_card_transform(i);
                const {translate, rotate} = _this.random_transform();
                const keyframes = [
                    {transform: `${translate} ${rotate}`, offset: 0},
                    {transform: `${card_transform.translate} ${card_transform.rotate}`, offset: 1},
                ];
                const options = {
                    fill: "forwards",
                    easing: "ease-in",
                    duration: (Math.random() + 1) * 1000,
                    iterations: 1,
                };
                const animation = $("#card-" + i)[0].animate(keyframes, options);
                animation.playbackRate = 0.1;
                const interval_id = setInterval(() => {
                    if (animation.playState !== 'finished') {
                        if (animation.playbackRate < 1) {
                            if (animation.playbackRate < 0.5) {
                                animation.playbackRate += 0.1;
                            } else {
                                animation.playbackRate += 0.2;
                            }
                            return
                        }
                    }
                    clearInterval(interval_id);
                }, 100)
                return animation.finished
            })
            this.finished = Promise.all(animations).then(() => {
                this.loading = false;
            })
        }
    },
}
const card_flip_animation = {
    loading: false,
    animations: [],
    finished: null,
    options: {fill: "forwards", easing: "ease-in", duration: 500, iterations: 1,},
    flip_back: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            $(".cards .card").addClass('two-face');
            const animations = cards.map(i => {
                const {translate, rotate} = rectangular_animation.get_card_transform(i);
                const keyframes = [{transform: `${translate} rotateY(180deg) rotateX(0deg)`}];
                const animate = $(`#card-${i}`)[0].animate(keyframes, _this.options);
                return animate.finished.then((a) => {
                    a.commitStyles()
                })
            })
            this.animations = animations;
            this.finished = Promise.all(animations).then(() => {
                _this.loading = false;
            })
        }
    },
    flip_front: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            const animations = cards.map(i => {
                const {translate, rotate} = rectangular_animation.get_card_transform(i);
                const keyframes = [{transform: `${translate} rotateY(0deg) rotateX(0deg)`}];
                const animate = $(`#card-${i}`)[0].animate(keyframes, _this.options);
                return animate.finished.then((a) => {
                    a.commitStyles()
                })
            })
            this.animations = animations;
            this.finished = Promise.all(animations).then(() => {
                $(".cards .card").removeClass('two-face');
                _this.loading = false;
            })
        }
    }
}
const cards_container_animation = {
    options: {fill: "forwards", easing: "ease-in", duration: 300, iterations: 1},
    far: function () {
        const keyframes = [
            {transform: `translate3d(0, 0, -1550px) rotate3d(0, 0, 0, 0deg)`, offset: 1},
        ];
        return $('.cards')[0].animate(keyframes, this.options).finished.then((a) => {
            a.commitStyles();
        })
    },
    near: function () {
        const keyframes = [
            {transform: `translate3d(0, 0, -750px) rotate3d(0, 0, 0, 0deg)`, offset: 1},
        ];
        return $('.cards')[0].animate(keyframes, this.options).finished.then((a) => {
            a.commitStyles();
        })
    },
    animation: null,
    rotate: function (n = 1) {
        const keyframes = [
            {transform: `translate3d(0, 0, -1550px) rotate3d(0, 1, 0, ${360 * n}deg)`, offset: 1},
        ];
        const options = {fill: "forwards", easing: "linear", duration: n * 1000, iterations: 1};
        const animation = $(`.cards`)[0].animate(keyframes, options);
        this.animation = animation;
    },
    stop_rotate: function () {
        const animation = this.animation;
        animation.pause();
        animation.cancel()
        return Promise.resolve(true);
    }
}
const ball_transforms = (circle_radius = 800) => {
    return [
        `matrix3d(1, 0, 0, 0, 0, 0.642788, 0.766044, 0, 0, -0.766044, 0.642788, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(1, 0, 0, 0, 0, 0.866025, 0.5, 0, 0, -0.5, 0.866025, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(1, 0, 0, 0, 0, 0.984808, 0.173648, 0, 0, -0.173648, 0.984808, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(1, 0, 0, 0, 0, 0.984808, -0.173648, 0, 0, 0.173648, 0.984808, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(1, 0, 0, 0, 0, 0.866025, -0.5, 0, 0, 0.5, 0.866025, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(1, 0, 0, 0, 0, 0.642788, -0.766044, 0, 0, 0.766044, 0.642788, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, -0.258819, 0, 0.12941, 0.866025, 0.482963, 0, 0.224144, -0.5, 0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, -0.258819, 0, 0.0449435, 0.984808, 0.167731, 0, 0.254887, -0.173648, 0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, -0.258819, 0, -0.0449435, 0.984808, -0.167731, 0, 0.254887, 0.173648, 0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, -0.258819, 0, -0.12941, 0.866025, -0.482963, 0, 0.224144, 0.5, 0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, -0.5, 0, 0.383022, 0.642788, 0.663414, 0, 0.321394, -0.766044, 0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, -0.5, 0, 0.25, 0.866025, 0.433013, 0, 0.433013, -0.5, 0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, -0.5, 0, 0.0868241, 0.984808, 0.150384, 0, 0.492404, -0.173648, 0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, -0.5, 0, -0.0868241, 0.984808, -0.150384, 0, 0.492404, 0.173648, 0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, -0.5, 0, -0.25, 0.866025, -0.433013, 0, 0.433013, 0.5, 0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, -0.5, 0, -0.383022, 0.642788, -0.663414, 0, 0.321394, 0.766044, 0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, -0.707107, 0, 0.353553, 0.866025, 0.353553, 0, 0.612372, -0.5, 0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, -0.707107, 0, 0.122788, 0.984808, 0.122788, 0, 0.696364, -0.173648, 0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, -0.707107, 0, -0.122788, 0.984808, -0.122788, 0, 0.696364, 0.173648, 0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, -0.707107, 0, -0.353553, 0.866025, -0.353553, 0, 0.612372, 0.5, 0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, -0.866025, 0, 0.663414, 0.642788, 0.383022, 0, 0.55667, -0.766044, 0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, -0.866025, 0, 0.433013, 0.866025, 0.25, 0, 0.75, -0.5, 0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, -0.866025, 0, 0.150384, 0.984808, 0.0868241, 0, 0.852869, -0.173648, 0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, -0.866025, 0, -0.150384, 0.984808, -0.0868241, 0, 0.852869, 0.173648, 0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, -0.866025, 0, -0.433013, 0.866025, -0.25, 0, 0.75, 0.5, 0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, -0.866025, 0, -0.663414, 0.642788, -0.383022, 0, 0.55667, 0.766044, 0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, -0.965926, 0, 0.482963, 0.866025, 0.12941, 0, 0.836516, -0.5, 0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, -0.965926, 0, 0.167731, 0.984808, 0.0449435, 0, 0.951251, -0.173648, 0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, -0.965926, 0, -0.167731, 0.984808, -0.0449435, 0, 0.951251, 0.173648, 0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, -0.965926, 0, -0.482963, 0.866025, -0.12941, 0, 0.836516, 0.5, 0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, -1, 0, 0.766044, 0.642788, 0, 0, 0.642788, -0.766044, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, -1, 0, 0.5, 0.866025, 0, 0, 0.866025, -0.5, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, -1, 0, 0.173648, 0.984808, 0, 0, 0.984808, -0.173648, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, -1, 0, -0.173648, 0.984808, 0, 0, 0.984808, 0.173648, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, -1, 0, -0.5, 0.866025, 0, 0, 0.866025, 0.5, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, -1, 0, -0.766044, 0.642788, 0, 0, 0.642788, 0.766044, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, -0.965926, 0, 0.482963, 0.866025, -0.12941, 0, 0.836516, -0.5, -0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, -0.965926, 0, 0.167731, 0.984808, -0.0449435, 0, 0.951251, -0.173648, -0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, -0.965926, 0, -0.167731, 0.984808, 0.0449435, 0, 0.951251, 0.173648, -0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, -0.965926, 0, -0.482963, 0.866025, 0.12941, 0, 0.836516, 0.5, -0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, -0.866025, 0, 0.663414, 0.642788, -0.383022, 0, 0.55667, -0.766044, -0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, -0.866025, 0, 0.433013, 0.866025, -0.25, 0, 0.75, -0.5, -0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, -0.866025, 0, 0.150384, 0.984808, -0.0868241, 0, 0.852869, -0.173648, -0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, -0.866025, 0, -0.150384, 0.984808, 0.0868241, 0, 0.852869, 0.173648, -0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, -0.866025, 0, -0.433013, 0.866025, 0.25, 0, 0.75, 0.5, -0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, -0.866025, 0, -0.663414, 0.642788, 0.383022, 0, 0.55667, 0.766044, -0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, -0.707107, 0, 0.353553, 0.866025, -0.353553, 0, 0.612372, -0.5, -0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, -0.707107, 0, 0.122788, 0.984808, -0.122788, 0, 0.696364, -0.173648, -0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, -0.707107, 0, -0.122788, 0.984808, 0.122788, 0, 0.696364, 0.173648, -0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, -0.707107, 0, -0.353553, 0.866025, 0.353553, 0, 0.612372, 0.5, -0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, -0.5, 0, 0.383022, 0.642788, -0.663414, 0, 0.321394, -0.766044, -0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, -0.5, 0, 0.25, 0.866025, -0.433013, 0, 0.433013, -0.5, -0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, -0.5, 0, 0.0868241, 0.984808, -0.150384, 0, 0.492404, -0.173648, -0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, -0.5, 0, -0.0868241, 0.984808, 0.150384, 0, 0.492404, 0.173648, -0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, -0.5, 0, -0.25, 0.866025, 0.433013, 0, 0.433013, 0.5, -0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, -0.5, 0, -0.383022, 0.642788, 0.663414, 0, 0.321394, 0.766044, -0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, -0.258819, 0, 0.12941, 0.866025, -0.482963, 0, 0.224144, -0.5, -0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, -0.258819, 0, 0.0449435, 0.984808, -0.167731, 0, 0.254887, -0.173648, -0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, -0.258819, 0, -0.0449435, 0.984808, 0.167731, 0, 0.254887, 0.173648, -0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, -0.258819, 0, -0.12941, 0.866025, 0.482963, 0, 0.224144, 0.5, -0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-1, 0, 0, 0, 0, 0.642788, -0.766044, 0, 0, -0.766044, -0.642788, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-1, 0, 0, 0, 0, 0.866025, -0.5, 0, 0, -0.5, -0.866025, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-1, 0, 0, 0, 0, 0.984808, -0.173648, 0, 0, -0.173648, -0.984808, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-1, 0, 0, 0, 0, 0.984808, 0.173648, 0, 0, 0.173648, -0.984808, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-1, 0, 0, 0, 0, 0.866025, 0.5, 0, 0, 0.5, -0.866025, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-1, 0, 0, 0, 0, 0.642788, 0.766044, 0, 0, 0.766044, -0.642788, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, 0.258819, 0, -0.12941, 0.866025, -0.482963, 0, -0.224144, -0.5, -0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, 0.258819, 0, -0.0449435, 0.984808, -0.167731, 0, -0.254887, -0.173648, -0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, 0.258819, 0, 0.0449435, 0.984808, 0.167731, 0, -0.254887, 0.173648, -0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.965926, 0, 0.258819, 0, 0.12941, 0.866025, 0.482963, 0, -0.224144, 0.5, -0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, 0.5, 0, -0.383022, 0.642788, -0.663414, 0, -0.321394, -0.766044, -0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, 0.5, 0, -0.25, 0.866025, -0.433013, 0, -0.433013, -0.5, -0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, 0.5, 0, -0.0868241, 0.984808, -0.150384, 0, -0.492404, -0.173648, -0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, 0.5, 0, 0.0868241, 0.984808, 0.150384, 0, -0.492404, 0.173648, -0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, 0.5, 0, 0.25, 0.866025, 0.433013, 0, -0.433013, 0.5, -0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.866025, 0, 0.5, 0, 0.383022, 0.642788, 0.663414, 0, -0.321394, 0.766044, -0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, 0.707107, 0, -0.353553, 0.866025, -0.353553, 0, -0.612372, -0.5, -0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, 0.707107, 0, -0.122788, 0.984808, -0.122788, 0, -0.696364, -0.173648, -0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, 0.707107, 0, 0.122788, 0.984808, 0.122788, 0, -0.696364, 0.173648, -0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.707107, 0, 0.707107, 0, 0.353553, 0.866025, 0.353553, 0, -0.612372, 0.5, -0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, 0.866025, 0, -0.663414, 0.642788, -0.383022, 0, -0.55667, -0.766044, -0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, 0.866025, 0, -0.433013, 0.866025, -0.25, 0, -0.75, -0.5, -0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, 0.866025, 0, -0.150384, 0.984808, -0.0868241, 0, -0.852869, -0.173648, -0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, 0.866025, 0, 0.150384, 0.984808, 0.0868241, 0, -0.852869, 0.173648, -0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, 0.866025, 0, 0.433013, 0.866025, 0.25, 0, -0.75, 0.5, -0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.5, 0, 0.866025, 0, 0.663414, 0.642788, 0.383022, 0, -0.55667, 0.766044, -0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, 0.965926, 0, -0.482963, 0.866025, -0.12941, 0, -0.836516, -0.5, -0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, 0.965926, 0, -0.167731, 0.984808, -0.0449435, 0, -0.951251, -0.173648, -0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, 0.965926, 0, 0.167731, 0.984808, 0.0449435, 0, -0.951251, 0.173648, -0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(-0.258819, 0, 0.965926, 0, 0.482963, 0.866025, 0.12941, 0, -0.836516, 0.5, -0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, 1, 0, -0.766044, 0.642788, 0, 0, -0.642788, -0.766044, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, 1, 0, -0.5, 0.866025, 0, 0, -0.866025, -0.5, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, 1, 0, -0.173648, 0.984808, 0, 0, -0.984808, -0.173648, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, 1, 0, 0.173648, 0.984808, 0, 0, -0.984808, 0.173648, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, 1, 0, 0.5, 0.866025, 0, 0, -0.866025, 0.5, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0, 0, 1, 0, 0.766044, 0.642788, 0, 0, -0.642788, 0.766044, 0, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, 0.965926, 0, -0.482963, 0.866025, 0.12941, 0, -0.836516, -0.5, 0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, 0.965926, 0, -0.167731, 0.984808, 0.0449435, 0, -0.951251, -0.173648, 0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, 0.965926, 0, 0.167731, 0.984808, -0.0449435, 0, -0.951251, 0.173648, 0.254887, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.258819, 0, 0.965926, 0, 0.482963, 0.866025, -0.12941, 0, -0.836516, 0.5, 0.224144, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, 0.866025, 0, -0.663414, 0.642788, 0.383022, 0, -0.55667, -0.766044, 0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, 0.866025, 0, -0.433013, 0.866025, 0.25, 0, -0.75, -0.5, 0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, 0.866025, 0, -0.150384, 0.984808, 0.0868241, 0, -0.852869, -0.173648, 0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, 0.866025, 0, 0.150384, 0.984808, -0.0868241, 0, -0.852869, 0.173648, 0.492404, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, 0.866025, 0, 0.433013, 0.866025, -0.25, 0, -0.75, 0.5, 0.433013, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.5, 0, 0.866025, 0, 0.663414, 0.642788, -0.383022, 0, -0.55667, 0.766044, 0.321394, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, 0.707107, 0, -0.353553, 0.866025, 0.353553, 0, -0.612372, -0.5, 0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, 0.707107, 0, -0.122788, 0.984808, 0.122788, 0, -0.696364, -0.173648, 0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, 0.707107, 0, 0.122788, 0.984808, -0.122788, 0, -0.696364, 0.173648, 0.696364, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.707107, 0, 0.707107, 0, 0.353553, 0.866025, -0.353553, 0, -0.612372, 0.5, 0.612372, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, 0.5, 0, -0.383022, 0.642788, 0.663414, 0, -0.321394, -0.766044, 0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, 0.5, 0, -0.25, 0.866025, 0.433013, 0, -0.433013, -0.5, 0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, 0.5, 0, -0.0868241, 0.984808, 0.150384, 0, -0.492404, -0.173648, 0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, 0.5, 0, 0.0868241, 0.984808, -0.150384, 0, -0.492404, 0.173648, 0.852869, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, 0.5, 0, 0.25, 0.866025, -0.433013, 0, -0.433013, 0.5, 0.75, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.866025, 0, 0.5, 0, 0.383022, 0.642788, -0.663414, 0, -0.321394, 0.766044, 0.55667, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, 0.258819, 0, -0.12941, 0.866025, 0.482963, 0, -0.224144, -0.5, 0.836516, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, 0.258819, 0, -0.0449435, 0.984808, 0.167731, 0, -0.254887, -0.173648, 0.951251, 0, 0, 0, ${circle_radius}, 1)`,
        `matrix3d(0.965926, 0, 0.258819, 0, 0.0449435, 0.984808, -0.167731, 0, -0.254887, 0.173648, 0.951251, 0, 0, 0, ${circle_radius}, 1)`
    ]
}
const ball_shape_animation = {
    loading: false,
    finished: null,
    options: {fill: "forwards", easing: "ease-in-out", duration: 1000, iterations: 1},
    transforms_begin: null,
    generate_rotateXY_list: function () {
        let rotateXY_list = [];
        [...Array(24).keys()].forEach(i => {
            const n = 8;
            const angle = 180 / (n + 1);
            let y = i * 15;
            let x_arr = [...Array(n).keys()].map((i) => i + 1).map((i) => 90 - angle * i)
            x_arr.shift()
            x_arr.pop()
            if (i % 2 === 1) {
                x_arr.shift()
                x_arr.pop()
            }
            let xy = x_arr.map(x => {
                return {x: x, y: y}
            })
            rotateXY_list.push(...xy)
        })
        return rotateXY_list
    },
    _to_ball: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            cards_container_animation.far();
            const rotateXY_list = this.generate_rotateXY_list();
            const circle_radius = 800;
            $(".cards .card").css('transform-origin', `center center -${circle_radius}px`);
            const animations = cards.map((i, index) => {
                let {x, y} = rotateXY_list[index];
                const transform = `translate3d(0, 0, ${circle_radius}px) rotateY(${y}deg) rotateX(${x}deg)`;
                const keyframes = [{transform: transform, offset: 1}];
                return $(`#card-${i}`)[0].animate(keyframes, _this.options)
            });
            this.finished = Promise.all(animations.map(a => a.finished)).then(() => {
                this.loading = false;
            })
            return this
        }
    },
    _to_rectangular: function () {
        if (!this.loading) {
            this.loading = true;
            cards_container_animation.near();
            this.finished = rectangular_animation.do(this.options).then(() => {
                $(".cards .card").css('transform-origin', `center center ${0}px`);
                this.loading = false;
            })
            return this
        }
    },
    to_ball: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            this.transforms_begin = cards.map((v, i) => $(`#card-${v}`).css('transform'));
            const circle_radius = 800;
            const transforms_end = ball_transforms(circle_radius);
            $(".cards .card").css('transform-origin', `center center -${circle_radius}px`);
            cards_container_animation.far();
            const animations = cards.map((v, index) => {
                const keyframes = [
                    {transform: `${transforms_end[index]} scale(1.4)`, offset: 1},
                ];
                return $(`#card-${v}`)[0].animate(keyframes, _this.options).finished.then((a) => {
                    a.commitStyles()
                })
            });
            this.finished = Promise.all(animations).then(() => {
                this.loading = false;
            })
            return this
        }
    },
    to_rectangular: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            cards_container_animation.near();
            const animations = cards.map((v, i) => {
                const keyframes = [{transform: _this.transforms_begin[i], offset: 1}];
                return $(`#card-${v}`)[0].animate(keyframes, _this.options).finished.then((a) => {
                    a.commitStyles()
                })
            })
            this.finished = Promise.all(animations).then(() => {
                $(".cards .card").css('transform-origin', `center center ${0}px`);
                _this.loading = false;
            })
            return this
        }
    }
}

/**############################*/
$(".buttons button").hide()
rectangular_animation.do_no_animate();
word_2023.init().show();
// prize_util.render();
random_place_animation.do();
random_place_animation.finished.then(() => {
    prize_util.render();
    person_manager.updating();
    buttons_manager.show('go_to_lottery');
})
/**############################*/
const person_random_choose = {
    choose_person: null,
    random_choose: function () {
        const _persons = persons_hide;
        const index = Math.floor(Math.random() * _persons.length);
        this.choose_person = _persons[index];
        return person_manager.show(this.choose_person);
    },
    finished: null,
    prev_transform: {},
    show_choose_person: function () {
        const $target = $(`[person-id=${this.choose_person.id}]`);
        this.prev_transform = {transform: $target.css('transform'), backgroundColor: $target.css('background-color')};
        const keyframes = [
            // {transform: `translate3d(0, 0, ${2200}px) rotateY(${0}deg) rotateX(${0}deg)`, offset: 1},
            {
                backgroundColor: 'rgba(255, 255, 0, 0.8)',
                transform: `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2200, 1)`,
                offset: 1
            },
        ];
        const options = {fill: "forwards", easing: "ease-out", duration: 1000, iterations: 1};
        this.finished = $target[0].animate(keyframes, options).finished;
        return this
    },
    not_show_choose_person: function () {
        const $target = $(`[person-id=${this.choose_person.id}]`);
        const keyframes = [{...this.prev_transform, offset: 1}];
        const options = {fill: "forwards", easing: "ease-out", duration: 1000, iterations: 1};
        this.finished = $target[0].animate(keyframes, options).finished;
        return this
    }
}
/**############################*/
let loading = false;
$("#go_to_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        word_2023.hide();
        prize_util.disable();
        ball_shape_animation.to_ball().finished.then(() => {
            loading = false;
            buttons_manager.show('start_lottery', 'quit_lottery')
        })
    }
});
$("#quit_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        word_2023.show();
        prize_util.enable();
        ball_shape_animation.to_rectangular().finished.then(() => {

            loading = false;
            buttons_manager.show('go_to_lottery');
        })
    }
});
let is_lottery = false;
$("#start_lottery").on('click', () => {
    if (prize_util.prize_finished()) {
        alert("此项奖品已抽完");
        return
    }
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        if (!is_lottery) {
            is_lottery = true;
            person_manager.stop_updating().last_animation_finished.then(() => {
                cards_container_animation.rotate(3600);
                buttons_manager.show('stop_lottery');
            })
        }
        loading = false;
    }
});

$("#stop_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        if (is_lottery) {
            cards_container_animation.stop_rotate().then(() => {
                is_lottery = false;
                person_random_choose.random_choose().then(() => {
                    person_random_choose.show_choose_person().finished.then(() => {
                        buttons_manager.show('confirm_lottery');
                        loading = false;
                    });
                })
            })
        }
    }
});


$("#confirm_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        person_random_choose.not_show_choose_person().finished.then(() => {
            prize_util.hit_the_jackpot(person_random_choose.choose_person);
            prize_util.show_winners();
            person_manager.updating();
            buttons_manager.show('start_lottery', 'quit_lottery');
            loading = false;
        });
    }
});
/**############################*/
/**############################*/
/**############################*/
/**############################*/


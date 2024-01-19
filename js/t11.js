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
    interval_id: null,
    last_animation: null,
    updating: function () {
        this.interval_id = setInterval(() => {
            let show_index = Math.floor(Math.random() * persons_show.length);
            let hide_index = Math.floor(Math.random() * persons_hide.length);
            this.update(show_index, persons_hide[hide_index]);
            let temp = persons_show[show_index];
            persons_show[show_index] = persons_hide[hide_index];
            persons_hide[hide_index] = temp;

            const keyframes = [
                {backgroundColor: `yellow`, offset: 0},
                {backgroundColor: `rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10})`, offset: 1},
            ];
            const options = {fill: "forwards", duration: 1000, iterations: 1};
            const animation = $(`#card-${show_index}`).find('.card-front')[0].animate(keyframes, options);
            animation.persist();
            this.last_animation = animation;
        }, 100)
    },
    stop_updating: function () {
        clearInterval(this.interval_id);
        return this.last_animation.finished
        // return Promise.resolve(undefined)
    }
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
            return $(`#card-${i}`)[0].animate(keyframes, options)
        });
        return Promise.all(animations.map(a => a.finished))
    }
}
const ball_shape_animation = {
    loading: false,
    finished: null,
    options: {fill: "forwards", easing: "ease-in-out", duration: 1000, iterations: 1},
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
    to_ball: function () {
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
                this.loading = false
            })
            return this
        }
    },
    to_rectangular: function () {
        if (!this.loading) {
            this.loading = true;
            cards_container_animation.near();
            this.finished = rectangular_animation.do(this.options).then(() => {
                $(".cards .card").css('transform-origin', `center center ${0}px`);
                this.loading = false;
            })
            return this
        }
    }
}
const random_place_animation = {
    loading: false,
    animations: [],
    finished: null,
    random_point_around_container: () => {
        const rate = 2;
        let w = Math.floor(Math.random() * window.innerWidth) - window.innerWidth / 2;
        let h = Math.floor(Math.random() * window.innerHeight) - window.innerHeight / 2;
        return {x: w * rate, y: h * rate}
    },
    random_transform: function () {
        const {x, y} = this.random_point_around_container();
        const z = Math.floor(Math.random() * 500) - 250;
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
                return $("#card-" + i)[0].animate(keyframes, options)
            })
            this.animations = animations
            this.finished = Promise.all(animations.map(a => a.finished)).then(() => {
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
            {transform: `translate3d(0, 0, -1550px) rotateY(0deg) rotateX(0deg)`, offset: 1},
        ];
        return $('.cards')[0].animate(keyframes, this.options).finished.then((a) => {
            a.commitStyles();
        })
    },
    near: function () {
        const keyframes = [
            {transform: `translate3d(0, 0, -750px) rotateY(0deg) rotateX(0deg)`, offset: 1},
        ];
        return $('.cards')[0].animate(keyframes, this.options).finished.then((a) => {
            a.commitStyles();
        })
    },
    animation: null,
    rotate: function (n = 1) {
        const keyframes = [
            {transform: `translate3d(0, 0, -1550px) rotateY(${360 * n}deg)`, offset: 1},
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

$(".buttons button").hide()
rectangular_animation.do_no_animate();
random_place_animation.do();
random_place_animation.finished.then(() => {
    buttons_manager.show('go_to_lottery');
    person_manager.updating();
})

let loading = false;
$("#go_to_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
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
        ball_shape_animation.to_rectangular().finished.then(() => {
            loading = false;
            buttons_manager.show('go_to_lottery');
        })
    }
});
let is_lottery = false;
$("#start_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        if (!is_lottery) {
            is_lottery = true;
            person_manager.stop_updating().then(() => {
                cards_container_animation.rotate(3600);
                buttons_manager.show('stop_lottery');
            })
        }
        loading = false;
    }
});
const person_random_choose = {
    choose_person: null,
    random_choose: function () {
        const index = Math.floor(Math.random() * persons_show.length);
        this.choose_person = persons_show[index];
    },
    animation: null,
    transform: '',
    show_choose_person: function () {
        const $target = $(`[person-id=${this.choose_person.id}]`);
        console.log($target.css('transform'));
        this.transform = $target.css('transform');
        const keyframes = [
            // {transform: `translate3d(0, 0, ${800}px) rotateY(${0}deg) rotateX(${0}deg)`, offset: 0.7},
            {transform: `translate3d(0, 0, ${2200}px) rotateY(${0}deg) rotateX(${0}deg)`, offset: 1},
        ];
        const options = {fill: "forwards", easing: "ease-out", duration: 1000, iterations: 1};
        const animation = $target[0].animate(keyframes, options);
        this.animation = animation;
        return animation.finished.then(() => {
            console.log($target.css('transform'));
        })
    },
    not_show_choose_person: function () {
        const $target = $(`[person-id=${this.choose_person.id}]`);
        const keyframes = [
            {transform: this.transform, offset: 1},
        ];
        const options = {fill: "forwards", easing: "ease-out", duration: 1000, iterations: 1};
        const animation = $target[0].animate(keyframes, options);
        return animation.finished
    }
}
$("#stop_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        if (is_lottery) {
            cards_container_animation.stop_rotate().then(() => {
                is_lottery = false;
                person_random_choose.random_choose();
                person_random_choose.show_choose_person().then(() => {
                    buttons_manager.show('confirm_lottery');
                    loading = false;
                });
            })
        }
    }
});


$("#confirm_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        buttons_manager.show_loading();
        person_random_choose.not_show_choose_person().then(() => {
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


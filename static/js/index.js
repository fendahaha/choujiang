const cards = [...Array(119).keys()];
const cards_render = () => {
    const cards_html = cards.map((i) => {
        return `<div class="card" id="card-${i}">
                <div class="card-back"></div>
                <div class="card-front">
                    <div class="card-front-1">LG</div>
                    <div class="card-front-2">${i}</div>
                    <div class="card-front-3">000000000</div>
                </div>
            </div>`
    }).join('');
    $(".cards").empty().append(cards_html);
}
/**############################*/
let prizes = get_prizes();
prizes.reverse();
let persons = get_persons();
/**############################*/
const bcr = $(".prizes-container-content0")[0].getBoundingClientRect();
const prize_manager = {
    current_prize_index: 0,
    last_animation: null,
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
    },
    prize_finished: function (index) {
        index = index ? index : this.current_prize_index;
        const prize = prizes[index];
        if (prize.total <= prize.winners.length) {
            return true
        }
        return false
    },
    hit_the_jackpot: function (person) {
        const prize = prizes[this.current_prize_index];
        prize.winners.push(person);
        if (save_hit_the_jackpot(prizes)) {
            const progress = (prize.winners.length / prize.total) * 100;
            $(`#prize-${prize.id}`).find('.progress').css('width', `${progress}%`);
            $(`#prize-${prize.id}`).find('.number').text(`${prize.winners.length}/${prize.total}`);
            return true;
        } else {
            alert("保存失败，请手动记录一下此中将结果");
            person['hit_the_jackpot'] = false;
            prize.winners.pop();
            return false;
        }
    },
    $prizes_target: $(".prizes"),
    render: function () {
        const html = prizes.map((prize, index) => {
            const progress = (prize.winners.length / prize.total) * 100;
            const rotateX = index * this.per_deg;
            return `<div class="prize" id="prize-${prize.id}" style="transform: rotateX(${rotateX}deg)">
                    <div class="left">
                        <img src="/static/img/dog.webp" alt="prize" class="icon"/>
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
    curr_deg: 0,
    per_deg: 360 / prizes.length,
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
        const winners = prizes[this.current_prize_index].winners;
        let html = winners.map((w, i) => {
            return `<div class="prize-winner">
                        <div class="department">${w.department}</div>
                        <div class="name">${w.name}</div>
                        <div class="employeeId">${w.employeeId}</div>
                    </div>`
        }).join('');
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
            this.show_winners();
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
const prize_choose_person = {
    choose_person: null,
    random_choose: function () {
        const _persons = this.get_lottery_persons();
        const index = Math.floor(Math.random() * _persons.length);
        this.choose_person = _persons[index];
        return this.choose_person
    },
    clear_choose: function () {
        this.choose_person = null;
    },
    get_lottery_persons: function () {
        const winners_employeeIds = prizes.reduce((prev, curr) => {
            return prev.concat(curr.winners)
        }, []).map(w => w.employeeId);
        const level = prizes[prize_manager.current_prize_index].level;
        const lottery_persons = persons.filter(p => p.can).filter(p => p.level === level).filter(p => {
            return !winners_employeeIds.includes(p.employeeId);
        })
        return lottery_persons
    },
}
/**############################*/
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
        if ($target.length > 0) {
            $target.attr('person-id', person.id);
            $target.find('.card-front-1').text(person.department)
            $target.find('.card-front-2').text(person.name)
            $target.find('.card-front-3').text(person.employeeId)
        }
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
            {backgroundColor: `rgba(255, 255, 0, 0.4)`, offset: 0},
            // {backgroundColor: `rgba(0, 127, 127, 1)`, offset: 0},
            {backgroundColor: `rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10})`, offset: 1},
        ];
        const options = {fill: "forwards", duration: 600, iterations: 1};
        this.last_animation_finished = $(`#card-${show_index}`).find('.card-front')[0]
            .animate(keyframes, options).finished.then((a) => {
                a.commitStyles()
            });
    },
    loading: false,
    is_updating: false,
    start_updating: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            if (!this.is_updating) {
                this.is_updating = true;
                if (persons_hide.length > 0) {
                    this.interval_id = setInterval(() => {
                        let show_index = Math.floor(Math.random() * persons_show.length);
                        let hide_index = Math.floor(Math.random() * persons_hide.length);
                        _this.swap(show_index, hide_index);
                        if (!$(`#card-${show_index}`).hasClass('highlight')) {
                            _this.do_animate(show_index);
                        }
                    }, 100);
                } else {
                    this.interval_id = setInterval(() => {
                        let show_index = Math.floor(Math.random() * persons_show.length);
                        let show_index2 = Math.floor(Math.random() * persons_show.length);
                        _this.update(show_index, persons_show[show_index2]);
                        _this.update(show_index2, persons_show[show_index]);
                        let temp = persons_show[show_index];
                        persons_show[show_index] = persons_show[show_index2];
                        persons_show[show_index2] = temp;
                        if (!$(`#card-${show_index}`).hasClass('highlight')) {
                            _this.do_animate(show_index);
                        }
                        if (!$(`#card-${show_index2}`).hasClass('highlight')) {
                            _this.do_animate(show_index2);
                        }
                    }, 100);
                }
            }
            this.loading = false;
        }
        return this
    },
    stop_updating: function () {
        if (!this.loading) {
            this.loading = true;
            if (this.is_updating) {
                this.is_updating = false;
                clearInterval(this.interval_id);
            }
            this.loading = false;
        }
        return this
    },
};
/**############################*/
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
    rotate: function (n = 3600) {
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
const ball_shape_animation = {
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
    ball_transforms: function (circle_radius) {
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
    },
    loading: false,
    finished: null,
    options: {fill: "forwards", easing: "ease-in-out", duration: 1000, iterations: 1},
    transforms_begin: [],
    circle_radius: 800,
    to_ball: function () {
        const _this = this;
        if (!this.loading) {
            this.loading = true;
            this.transforms_begin = cards.map((v, i) => $(`#card-${v}`).css('transform'));
            const transforms_end = this.ball_transforms(this.circle_radius);
            $(".cards .card").css('transform-origin', `center center -${this.circle_radius}px`);
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
    },
}
const ball_shape_card_animation = {
    finished: Promise.resolve(true),
    prev_transform: {},
    options: {fill: "forwards", easing: "ease-out", duration: 800, iterations: 1},
    is_showing: false,
    card_id: null,
    show_card: function (card_id) {
        if (!this.is_showing) {
            this.is_showing = true;
            this.card_id = card_id;
            const $target = $(`#${card_id}`);
            this.prev_transform = {
                transform: $target.css('transform'),
                backgroundColor: $target.css('background-color')
            };
            const keyframes = [
                {
                    backgroundColor: 'rgba(255, 255, 0, 0.8)',
                    transform: `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2200, 1)`,
                    // transform: `matrix3d(4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 1200, 1)`,
                    offset: 1
                }
            ];
            this.finished = $target[0].animate(keyframes, this.options).finished;
        }
        return this
    },
    not_show_card: function () {
        if (this.is_showing) {
            this.is_showing = false;
            const $target = $(`#${this.card_id}`);
            const keyframes = [{...this.prev_transform, offset: 1}];
            const options = {fill: "forwards", easing: "ease-out", duration: 400, iterations: 1};
            this.finished = $target[0].animate(keyframes, options).finished;
        }
        return this
    }
}
const firworks_animation = {
    firworks_parent: document.querySelector(".fireworks"),
    randomColor: function () {
        let color = "rgb("
        let r = parseInt(Math.random() * 256);
        let g = parseInt(Math.random() * 256);
        let b = parseInt(Math.random() * 256);
        color = color + r + "," + g + "," + b + ")";
        return color;
    },
    create_div: function (x, y) {
        let div = document.createElement("div");
        div.style.backgroundColor = this.randomColor();
        div.style.width = '4px';
        div.style.height = '4px';
        div.style.position = 'absolute';
        div.style.left = x + "px";
        div.style.top = y + "px";
        this.firworks_parent.appendChild(div);
        return div
    },
    generate_speed: function () {
        let x = (parseInt(Math.random() * 2) == 0 ? 1 : -1) * parseInt(Math.random() * 36 + 1);
        let y = (parseInt(Math.random() * 2) == 0 ? 1 : -1) * parseInt(Math.random() * 20 + 1);
        return {x, y}
    },
    run: function () {
        $(".fireworks").remove();
        $("body").append(`<div class="fireworks"></div>`);
        this.firworks_parent = $(".fireworks")[0];
        const width = this.firworks_parent.offsetWidth;
        const height = this.firworks_parent.offsetHeight;
        const x = width / 2;
        const y = height / 2

        const _this = this;
        let items = [];
        let speeds = [];
        [...Array(200).keys()].forEach(i => {
            items.push(_this.create_div(x, y));
            speeds.push(_this.generate_speed());
        })
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                let i = 3;
                const intervalId = setInterval(() => {
                    i++;
                    let indexs = [];
                    items.forEach((div, index) => {
                        const speed = speeds[index];
                        div.style.left = parseInt(div.style.left) + speed.x + "px";
                        div.style.top = parseInt(div.style.top) + speed.y + i + "px";
                        let left = parseInt(div.style.left);
                        let top = parseInt(div.style.top);
                        if (left > width
                            || top > height
                            || left < 2
                            || top < 2) {
                            div.remove();
                            indexs.push(index);
                        }
                    })
                    items = items.filter((e, i) => {
                        return !indexs.includes(i);
                    })
                    speeds = speeds.filter((e, i) => {
                        return !indexs.includes(i);
                    })
                    if (items.length <= 0) {
                        clearInterval(intervalId);
                        $(".fireworks").remove();
                    }
                }, 30)
            })
        })
    },
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
const event_manager = {
    loading: false,
    is_lottery: false,
    go_to_lottery: function () {
        if (!this.loading) {
            this.loading = true;
            buttons_manager.show_loading();
            word_2023.hide();
            Promise.all([
                prize_manager.disable(),
                cards_container_animation.far(),
                ball_shape_animation.to_ball().finished
            ]).then(() => {
                buttons_manager.show('start_lottery', 'quit_lottery');
                this.loading = false;
            })
        }
    },
    quit_lottery: function () {
        if (!this.loading) {
            this.loading = true;
            buttons_manager.show_loading();
            word_2023.show();
            Promise.all([
                prize_manager.enable(),
                cards_container_animation.near(),
                ball_shape_animation.to_rectangular().finished
            ]).then(() => {
                buttons_manager.show('go_to_lottery');
                this.loading = false;
            })
        }
    },
    start_lottery: function () {
        if (prize_manager.prize_finished()) {
            alert("此项奖品已抽完");
            return
        }
        if (!this.loading) {
            this.loading = true;
            if (!this.is_lottery) {
                buttons_manager.show_loading();
                person_manager.stop_updating().last_animation_finished.then(() => {
                    cards_container_animation.rotate();
                    buttons_manager.show('stop_lottery');
                    this.is_lottery = true;
                    this.loading = false;
                })
            }
        }
    },
    stop_lottery: function () {
        if (!this.loading) {
            this.loading = true;
            if (this.is_lottery) {
                buttons_manager.show_loading();
                cards_container_animation.stop_rotate().then(() => {
                    const choose_person = prize_choose_person.random_choose();
                    person_manager.show(choose_person).then(() => {
                        const card_id = $(`[person-id='${choose_person.id}']`).attr('id');
                        ball_shape_card_animation.show_card(card_id).finished.then(() => {
                            firworks_animation.run();
                            buttons_manager.show('confirm_lottery', 'cancel_lottery');
                            this.is_lottery = false;
                            this.loading = false;
                        })
                    })
                })
            }
        }
    },
    confirm_lottery: function () {
        if (!this.loading) {
            this.loading = true;
            buttons_manager.show_loading();
            ball_shape_card_animation.not_show_card().finished.then(() => {
                let success = prize_manager.hit_the_jackpot(prize_choose_person.choose_person);
                if (success) {
                    prize_manager.show_winners();
                }
                person_manager.start_updating();
                buttons_manager.show('start_lottery', 'quit_lottery');
                this.loading = false;
            })
        }
    },
    cancel_lottery: function () {
        if (!this.loading) {
            if (!confirm("是否取消")) {
                return
            }
            this.loading = true;
            buttons_manager.show_loading();
            prize_choose_person.clear_choose();
            ball_shape_card_animation.not_show_card().finished.then(() => {
                person_manager.start_updating();
                buttons_manager.show('start_lottery', 'quit_lottery');
                this.loading = false;
            })

        }
    }
}
/**############################*/
$("#go_to_lottery").on('click', () => {
    event_manager.go_to_lottery()
});
$("#quit_lottery").on('click', () => {
    event_manager.quit_lottery()
});
$("#start_lottery").on('click', () => {
    event_manager.start_lottery()
});

$("#stop_lottery").on('click', () => {
    event_manager.stop_lottery()
});
$("#confirm_lottery").on('click', () => {
    event_manager.confirm_lottery()
});
$("#cancel_lottery").on('click', () => {
    event_manager.cancel_lottery()
});
/**############################*/
$(".prize_choose_next").on('click', () => {
    prize_manager.choose_next()
})
$(".prize_choose_prev").on('click', () => {
    prize_manager.choose_prev();
})
/**############################*/
/**############################*/
/**############################*/
/**############################*/
cards_render();
person_manager.upload();
rectangular_animation.do_no_animate();
random_place_animation.do();
word_2023.init().show();
random_place_animation.finished.then(() => {
    prize_manager.render();
    person_manager.start_updating();
    buttons_manager.show('go_to_lottery');
})
/**############################*/


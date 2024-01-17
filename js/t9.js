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
console.log(window.innerWidth, window.innerHeight);
let rate = window.innerWidth * 0.6 / (17 * 100 + 16 * 20)
$(".cj-container-show-persons").css('transform', `scale(${rate})`)
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
const persons_show = persons.slice(0, 17 * 7);
const persons_hide = persons.slice(17 * 7);
/**###############################*/
const person_manager = {
    create_person: (e, hide = false) => {
        return `<div class="cj-person ${hide ? 'hide' : ''}" id="${e.id}">
            <div class="cj-person-front" style="${e.style}">
                <div class="cj-person-front-1">LG</div>
                <div class="cj-person-front-2">${e.name}</div>
                <div class="cj-person-front-3">${e.employeeId}</div>
            </div>
            <div class="cj-person-back"></div>
        </div>`
    },
    update_person: function (p_id, data) {
        $(`#${p_id}`).find(".cj-person-front-2").text(data.name);
        $(`#${p_id}`).find(".cj-person-front-3").text(data.employeeId);
        $(`#${p_id}`).attr('id', data.id);
    },
    render_show_person: function () {
        const persons_html = persons_show.map(e => person_manager.create_person(e)).join('');
        $(".cj-container-show-persons .cj-person").remove();
        $(".cj-container-show-persons").append(persons_html);
    },
    render_hide_person: function () {
        const persons_html = persons_hide.map(e => person_manager.create_person(e)).join('');
        $(".cj-container-hidden-persons .cj-person").remove();
        $(".cj-container-hidden-persons").append(persons_html);
    },
    render_person: function () {
        this.render_show_person();
        this.render_hide_person();
    }
}
const random_place_person = {
    random_place_person_animations: [],
    random_place_person_animations_finished: true,
    choose_random_point: () => {
        let w = Math.floor(Math.random() * (window.innerWidth - 100));
        let h = Math.floor(Math.random() * (window.innerHeight - 140));
        return {left: w, top: h}
    },
    start: function () {
        // $(".cj-person").css('transition', 'none')
        // window.requestAnimationFrame(function (time) {
        //     window.requestAnimationFrame(function (time) {
        //         persons_show.forEach(e => {
        //             let $target = $(`#${e.name}`);
        //             $target.css('transform', 'translate3d(0,0,0) rotateY(360deg)');
        //             $target.css('transition', `all ${Math.random() + 2}s ease-in`)
        //         })
        //     });
        // });
        // persons_show.forEach(e => {
        //     let $target = $(`#${e.name}`);
        //     const bcr = $target[0].getBoundingClientRect();
        //     const point = choose_random_point();
        //     let x = (point.left - bcr.left) * 1.9;
        //     let y = (point.top - bcr.top) * 1.9;
        //     let z = Math.floor(Math.random() * 500) - 250;
        //     $target.css('transform', `translate3d(${x}px, ${y}px, ${z}px) rotateY(0deg)`)
        // })
        if (this.random_place_person_animations_finished) {
            this.random_place_person_animations_finished = false;
            persons_show.forEach(e => {
                let $target = $(`#${e.id}`);
                const bcr = $target[0].getBoundingClientRect();
                const point = this.choose_random_point();
                let x = (point.left - bcr.left) * 1.9;
                let y = (point.top - bcr.top) * 1.9;
                let z = Math.floor(Math.random() * 500) - 250;

                let target = $(`#${e.id}`)[0];
                const keyframes = [
                    {transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(0deg)`, offset: 0},
                    {transform: 'translate3d(0,0,0) rotateY(360deg)', offset: 1},
                ];
                const options = {
                    fill: "forwards",
                    // easing: "steps(4, end)",
                    easing: "ease-in",
                    duration: (Math.random() + 2) * 1000,
                    iterations: 1,
                };
                const animate = target.animate(keyframes, options);
                this.random_place_person_animations.push(animate);
            })
            const _this = this;
            Promise.all(
                this.random_place_person_animations.map((animation) => animation.finished),
            ).then(() => {
                _this.random_place_person_animations.forEach(a => {
                    a.commitStyles();
                    a.cancel();
                })
                _this.random_place_person_animations = [];
                _this.random_place_person_animations_finished = true;
            });
            return this
        }
    },
    finished: function () {
        return Promise.all(
            this.random_place_person_animations.map((animation) => animation.finished),
        )
    }
}
const updating_manager = {
    last_update_animation: null,
    updating_interval_id: null,
    is_updating: false,
    loading: false,
    update: function () {
        let hide_index = Math.floor(Math.random() * persons_hide.length);
        let show_index = Math.floor(Math.random() * persons_show.length);
        let temp = persons_show[show_index];
        persons_show[show_index] = persons_hide[hide_index];
        persons_hide[hide_index] = temp;
        person_manager.update_person(persons_hide[hide_index].id, persons_show[show_index])

        const target = $(`#${persons_show[show_index].id} .cj-person-front`)[0];
        const keyframes = [
            {backgroundColor: `yellow`, offset: 0},
            {backgroundColor: `rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10})`, offset: 1},
        ];
        const options = {
            fill: "forwards",
            duration: 1000,
            iterations: 1,
        };
        const animation = target.animate(keyframes, options)
        this.last_update_animation = animation;
        animation.persist();
    },
    start_updating: function () {
        if (!this.loading) {
            this.loading = true;
            if (this.is_updating) {
                this.loading = false;
                return Promise.resolve(undefined)
            }
            this.is_updating = true;
            console.log('start');
            const _this = this;
            return random_place_person.finished().then(() => {
                _this.updating_interval_id = setInterval(() => {
                    _this.update();
                }, 100);
                _this.loading = false;
            })
        }
    },
    stop_updating: function () {
        if (!this.loading) {
            this.loading = true;
            if (!this.is_updating) {
                this.loading = false;
                return Promise.resolve(undefined)
            }
            console.log('stop');
            clearInterval(this.updating_interval_id);
            const _this = this;
            return this.last_update_animation.finished.then(() => {
                _this.is_updating = false;
                _this.loading = false;
            })
        }
        return Promise.resolve(undefined)
    }
}

person_manager.render_person();
random_place_person.start();
random_place_person.finished().then(() => {
    updating_manager.start_updating();
});

/**#############################*/
const choose_manager = {
    choose_data: {current: null},
    last_animation: null,
    choose_intervalId: null,
    is_choosing: false,
    loading: false,
    getOffsets: (_c) => {
        let c = document.getElementById(_c);
        return {left: c.offsetLeft, top: c.offsetTop}
    },
    choose_next: function () {
        const n = Math.floor(Math.random() * persons_show.length);
        this.choose_data.current = n;
        const offsets = this.getOffsets(persons_show[n].id);
        const keyframes = [
            {left: offsets.left + 'px', top: offsets.top + 'px'},
        ];
        const options = {
            fill: "forwards",
            easing: "ease-in",
            duration: 100,
            iterations: 1,
        };
        const animation = $("#cj-choose")[0].animate(keyframes, options);
        this.last_animation = animation;
        animation.persist();
    },
    start_choose: function () {
        if (!this.loading) {
            this.loading = true;
            if (this.is_choosing) {
                this.loading = false;
                return
            }
            console.log("start choose");
            $("#cj-choose").show();
            const _this = this;
            this.choose_intervalId = setInterval(() => _this.choose_next(), 100);
            this.is_choosing = true;
            this.loading = false;
        }
    },
    stop_choose: function () {
        if (!this.loading) {
            this.loading = true;
            if (!this.is_choosing) {
                this.loading = false;
                return Promise.resolve(undefined)
            }
            console.log("stop choose");
            clearInterval(this.choose_intervalId);
            const _this = this;
            return this.last_animation.finished.then(() => {
                console.log(_this.choose_data);
                // $("#cj-choose").hide();
                _this.is_choosing = false;
                _this.loading = false;
            })
        } else {
            return Promise.resolve(undefined)
        }
    },
}

// $("#test1").on('click', () => {
//     choose_manager.start_choose()
// })
// $("#test2").on('click', () => {
//     choose_manager.stop_choose()
// })
/**###############################*/

// $("#go_to_lottery")
// $("#start_lottery")
// $("#stop_lottery")
let loading = false;
$("#go_to_lottery").on('click', () => {
    if (!loading) {
        loading = true;
        $("#go_to_lottery").addClass('disable');
        random_place_person.finished().then(() => {
            updating_manager.stop_updating().then(() => {
                $(".cj-container-show-persons").addClass("show_back")
                $(".cj-container-show-persons .cj-person").css('transition', 'all 1s');
                $(".cj-container-show-persons .cj-person").css('transform', 'translate3d(0, 0, 0) rotateY(180deg)');
                setTimeout(() => {
                    loading = false;
                    $("#go_to_lottery").removeClass('disable');
                    $("#go_to_lottery").hide();
                    $("#start_lottery").show();
                    $("#stop_lottery").hide();
                }, 1000)
            })
        });
    }
});


let is_lottery = false;
const change_lottery_status = (is_lottery) => {
    if (is_lottery) {
        $("#start_lottery").hide();
        $("#stop_lottery").show();

        updating_manager.stop_updating().then(() => {
            $(".cj-container-show-persons").addClass("show_back")
            $(".cj-container-show-persons .cj-person").css('transition', 'all 1s');
            $(".cj-container-show-persons .cj-person").css('transform', 'translate3d(0, 0, 0) rotateY(180deg)');
            setTimeout(() => {
                choose_manager.start_choose()
            }, 1000)
        })
    } else {
        $("#start_lottery").show();
        $("#stop_lottery").hide();
        choose_manager.stop_choose().then(() => {
            $(".cj-container-show-persons").removeClass("show_back")
            $(".cj-container-show-persons .cj-person").css('transition', 'all 1s');
            $(".cj-container-show-persons .cj-person").css('transform', 'translate3d(0, 0, 0) rotateY(0deg)');
            setTimeout(() => {
                updating_manager.start_updating();
            }, 1000)
        })

    }
}
$("#start_lottery").on('click', () => {
    if (!is_lottery) {
        is_lottery = true;
        change_lottery_status(is_lottery);
    }
})

$("#stop_lottery").on('click', () => {
    if (is_lottery) {
        is_lottery = false;
        change_lottery_status(is_lottery);
    }
})

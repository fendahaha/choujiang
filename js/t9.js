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
        id: e,
        name: `p-${e}`,
        style: `background-color: rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10});`
    }
});
const persons_show = persons.slice(0, 17 * 7);
const persons_hide = persons.slice(17 * 7);
const create_person = (e) => {
    return `<div class="cj-person" id="${e.name}">
            <div class="cj-person-front" style="${e.style}">
                <div class="cj-person-front-1">LG</div>
                <div class="cj-person-front-2">${e.id}啊</div>
                <div class="cj-person-front-3">251900006</div>
            </div>
            <div class="cj-person-back"></div>
        </div>`
}
const render_show_person = () => {
    const persons_html = persons_show.map(e => create_person(e)).join('');
    $(".cj-container-show-persons .cj-person").remove();
    $(".cj-container-show-persons").append(persons_html);
}
const render_hide_person = () => {
    const persons_html = persons_hide.map(e => create_person(e)).join('');
    $(".cj-container-hidden-persons .cj-person").remove();
    $(".cj-container-hidden-persons").append(persons_html);
}
const choose_random_point = () => {
    let w = Math.floor(Math.random() * (window.innerWidth - 100));
    let h = Math.floor(Math.random() * (window.innerHeight - 140));
    return {left: w, top: h}
}
let random_place_person_animations = [];
let random_place_person_animations_finished = true;

function random_place_person() {
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
    if (random_place_person_animations_finished) {
        random_place_person_animations_finished = false;
        persons_show.forEach(e => {
            let $target = $(`#${e.name}`);
            const bcr = $target[0].getBoundingClientRect();
            const point = choose_random_point();
            let x = (point.left - bcr.left) * 1.9;
            let y = (point.top - bcr.top) * 1.9;
            let z = Math.floor(Math.random() * 500) - 250;

            let target = $(`#${e.name}`)[0];
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
            random_place_person_animations.push(animate);
        })
        Promise.all(
            random_place_person_animations.map((animation) => animation.finished),
        ).then(() => {
            random_place_person_animations.forEach(a => {
                a.commitStyles();
                a.cancel();
            })
            random_place_person_animations = [];
            random_place_person_animations_finished = true;
        });
    }
}

render_show_person();
render_hide_person();
random_place_person();
/**###########################*/
let updating_timeout_id = null;
let updating_interval_id = null;
const stop_updating = () => {
    clearTimeout(updating_timeout_id);
    clearInterval(updating_interval_id);
}
const update = () => {
    let hide_index = Math.floor(Math.random() * persons_hide.length);
    let show_index = Math.floor(Math.random() * persons_show.length);
    let $hide_target = $(`#${persons_hide[hide_index].name}`);
    let $show_target = $(`#${persons_show[show_index].name}`);
    let temp = persons_show[show_index];
    persons_show[show_index] = persons_hide[hide_index];
    persons_hide[hide_index] = temp;
    let hide_clone = $hide_target.clone();
    let show_clone = $show_target.clone();
    $hide_target.replaceWith(show_clone);
    $show_target.replaceWith(hide_clone);
    const target = $(`#${persons_show[show_index].name} .cj-person-front`)[0];
    const keyframes = [
        // {backgroundColor: `yellow`, offset: 0.5},
        {backgroundColor: `rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10})`, offset: 1},
    ];
    const options = {
        fill: "forwards",
        duration: 1000,
        iterations: 1,
    };
    target.animate(keyframes, options).persist()
}
const start_updating = () => {
    updating_interval_id = setInterval(() => {
        // update()
    }, 100)
}
updating_timeout_id = setTimeout(() => {
    // start_updating();
}, 4000)
$("#test").on('click', () => {
    update()
})

/**#############################*/
function getOffsets(_c) {
    let c = document.getElementById(_c);
    return {left: c.offsetLeft, top: c.offsetTop}
}

const getRandowNum = () => Math.floor(Math.random() * persons_show.length);
const next_data = {next: null};
const choose_next = () => {
    const n = getRandowNum();
    next_data.next = n;
    const offsets = getOffsets(persons_show[n].name);
    $("#cj-choose").css(offsets)
}
/**###############################*/
let is_lottery = false;
let intervalId = null;
const change_lottery_status = (is_lottery) => {
    if (is_lottery) {
        $("#start_lottery").hide();
        $("#stop_lottery").show();

        stop_updating();
        setTimeout(() => {
            $(".cj-container-show-persons").addClass("show_back")
            $(".cj-person").css('transition', 'all 1s');
            $(".cj-person").css('transform', 'translate3d(0, 0, 0) rotateY(180deg)');
            setTimeout(() => {
                $("#cj-choose").show()
                intervalId = setInterval(() => choose_next(), 100)
            }, 1000)
        }, 100)
    } else {
        $("#start_lottery").show();
        $("#stop_lottery").hide();
        clearInterval(intervalId)
        $(".cj-container-show-persons").removeClass("show_back")
        $(".cj-person").css('transition', 'all 1s');
        $(".cj-person").css('transform', 'translate3d(0, 0, 0) rotateY(0deg)');
        $("#cj-choose").hide()
        setTimeout(() => {
            start_updating();
        }, 1000)
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

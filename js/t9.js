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
$(".cj-container-content").css('transform', `scale(${rate})`)
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
const show_person = () => {
    const persons_html = persons_show.map(e => create_person(e)).join('');
    $(".cj-person").remove();
    $(".cj-container-content").append(persons_html)
}

function choose_random_point() {
    let w = Math.floor(Math.random() * (window.innerWidth - 100));
    let h = Math.floor(Math.random() * (window.innerHeight - 140));
    return {left: w, top: h}
}

function random_place_person() {
    $(".cj-person").css('transition', 'none')
    persons_show.forEach(e => {
        let $target = $(`#${e.name}`);
        const bcr = $target[0].getBoundingClientRect();
        const point = choose_random_point();
        let x = (point.left - bcr.left) * 1.9;
        let y = (point.top - bcr.top) * 1.9;
        let z = Math.floor(Math.random() * 500) - 250
        $target.css('transform', `translate3d(${x}px, ${y}px, ${z}px) rotateY(0deg)`)
    })
    window.requestAnimationFrame(function (time) {
        window.requestAnimationFrame(function (time) {
            persons_show.forEach(e => {
                let $target = $(`#${e.name}`);
                $target.css('transform', 'translate3d(0,0,0) rotateY(360deg)');
                $target.css('transition', `all ${Math.random() + 2}s ease-in`)
            })
        });
    });
}

show_person();
random_place_person();
let updating_timeout_id = null;
let updating_interval_id = null;
const stop_updating = () => {
    clearTimeout(updating_timeout_id);
    clearInterval(updating_interval_id);
}
const start_updating = () => {
    updating_interval_id = setInterval(() => {
        let random_index = Math.floor(Math.random() * persons_hide.length);
        let random_index2 = Math.floor(Math.random() * persons_show.length);
        let temp = persons_show[random_index2];
        persons_show[random_index2] = persons_hide[random_index];
        persons_hide[random_index] = temp;
        $(`#${persons_hide[random_index].name}`).replaceWith(create_person(persons_show[random_index2]))
        const target = $(`#${persons_show[random_index2].name} .cj-person-front`)[0];
        const keyframes = [
            // {backgroundColor: `yellow`, offset: 0.5},
            {backgroundColor: `rgba(0, 127, 127, ${(Math.random() * 6 + 2) / 10})`, offset: 1},
        ];
        const options = {
            fill: "forwards",
            duration: 1000,
            iterations: 1,
        };
        target.animate(keyframes, options).finished.then((animate) => animate.commitStyles());
    }, 100)
}
updating_timeout_id = setTimeout(() => {
    start_updating();
}, 3000)

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
            $(".cj-container-content").addClass("show_back")
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
        $(".cj-container-content").removeClass("show_back")
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

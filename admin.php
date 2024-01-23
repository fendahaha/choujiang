<?php
require_once 'util.php';
initial();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin</title>
    <script src="/static/js/jquery/3.7.1/jquery.min.js"></script>
    <link rel="stylesheet" href="/static/css/common.css">
    <style>
        body {
            background-color: black;
        }

        .main {
            width: 1024px;
            height: 100%;
            margin: 0 auto;
        }

        .buttons {
            height: 80px;
        }

        .results {
            height: calc(100% - 80px);
            overflow: auto;
        }

        .buttons {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .buttons .button {
            flex: 0 0 auto;
            box-shadow: 0px 0px 15px rgb(127 255 255 / 75%);
            color: rgba(127, 255, 255, 0.75);
            background: transparent;
            outline: 1px solid rgba(127, 255, 255, 0.75);
            border: 0;
            padding: 10px 20px;
            cursor: pointer;
            margin: 0 20px;
        }

        .prize_result {
            padding: 0 20px;
            border-top: 1px dashed rgba(127, 255, 255, 0.75);
        }

        .prize {
            color: rgba(127, 255, 255, 0.75);
            margin: 10px 0;
        }

        .prize_persons {
            margin: 10px 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-start;
            gap: 20px;
        }

        .prize_persons > * {
            flex: 0 0 auto;
        }
    </style>
    <style>
        .card {
            z-index: 0;
            width: 100px;
            height: 126px;
            transform-style: preserve-3d;
            transform-origin: center center 0;
            transform: translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg);
        }

        .card-front {
            z-index: 1;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            color: rgba(127, 255, 255, 0.75);
            background-color: rgba(0, 127, 127, 0.282);
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
            border: 1px solid rgba(127, 255, 255, 0.75);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            backface-visibility: visible;
            transition: background-color 0.5s linear;
        }

        .card.highlight.show_highlight .card-front {
            background-color: rgba(253, 105, 0, 0.95);
        }

        .card-front:hover {
            box-shadow: 0 0 18px rgba(0, 255, 255, 1);
            border: 2px solid rgba(127, 255, 255, 1);
        }

        .card-back {
            z-index: 0;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: darkolivegreen;
            color: white;
            backface-visibility: hidden;
            transform: translateZ(0px) rotateY(180deg);
            opacity: 0;
        }

        .card.two-face .card-front {
            backface-visibility: hidden;
        }

        .card.two-face .card-back {
            opacity: 1;
        }

        .card-front-1 {
            font-size: 16px;
        }

        .card-front-2 {
            font-size: 28px;
        }

        .card-front-3 {
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="main">
    <div class="buttons">
        <button class="button">导出数据</button>
        <button class="button">重置数据</button>
    </div>
    <div class="results">
        <div class="prize_result" style="display: none">
            <h2 class="prize">現金20萬</h2>
            <div class="prize_persons">
                <div class="card">
                    <div class="card-back"></div>
                    <div class="card-front">
                        <div class="card-front-1">LG</div>
                        <div class="card-front-2">0</div>
                        <div class="card-front-3">251900006</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="/static/js/api.js"></script>
<script>
    let prizes = get_prizes();

    function create_prize_person(person) {
        return `<div class="card">
                    <div class="card-back"></div>
                    <div class="card-front">
                        <div class="card-front-1">${person.department}</div>
                        <div class="card-front-2">${person.name}</div>
                        <div class="card-front-3">${person.employeeId}</div>
                    </div>
                </div>`
    }

    function create_prize_result(prize) {
        const persons = prize.winners.map(person => create_prize_person(person)).join("");
        return `<div class="prize_result">
            <h2 class="prize">${prize.level}&nbsp;${prize.name}</h2>
            <div class="prize_persons">
                ${persons}
            </div>
        </div>`
    }

    $(".results").empty().append(prizes.map(prize => create_prize_result(prize)).join(""));
</script>
</body>
</html>
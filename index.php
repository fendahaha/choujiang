<?php
require_once 'util.php';
initial();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lottery</title>
    <script src="/static/js/jquery/3.7.1/jquery.min.js"></script>
    <link rel="stylesheet" href="/static/css/common.css">
    <link rel="stylesheet" href="/static/css/index.css">
</head>
<body>
<style>
    .admin_control {
        padding: 5px;
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 9999;
    }

    .admin_control_button {
        text-decoration: none;
        color: white;
    }
</style>
<div class="admin_control">
    <a class="admin_control_button" href="/admin.php" target="_blank">控制台</a>
</div>
<div class="main unselectable">
    <div class="cj-container">
        <div class="cards">
            <div class="card" id="card-0">
                <div class="card-back"></div>
                <div class="card-front">
                    <div class="card-front-1">LG</div>
                    <div class="card-front-2">0</div>
                    <div class="card-front-3">251900006</div>
                </div>
            </div>
        </div>
    </div>
    <div class="prizes-container">
        <div class="prizes-container-content">
            <div class="prizes-container-content0" style="z-index: 0">
                <div class="prizes">
                    <div class="prize" style="display: none;">
                        <div class="left">
                            <img src="/static/img/dog.webp" alt="prize" class="icon"/>
                        </div>
                        <div class="right">
                            <div class="name">二等奖 华为 Mate30</div>
                            <div class="count">
                                <div class="progress" style="width:20%;"></div>
                                <span class="number">2/10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="prize-winners" style="z-index: 1;">
                <div class="prize-winners-content">
                    <div class="prize-winner">
                        <div class="department">dadad</div>
                        <div class="name">dasd</div>
                        <div class="employeeId">q3142424234</div>
                    </div>
                </div>
            </div>
            <div class="prize_choose_buttons hide" style="z-index: 2;">
                <button class="prize_choose_button prize_choose_prev">prev</button>
                <button class="prize_choose_button prize_choose_next">next</button>
            </div>
        </div>
    </div>
    <div class="buttons">
        <button class="button" id="loading">
            <span class="name">Loading...</span>
        </button>
        <button class="button" id="go_to_lottery">
            <span class="state">Loading...</span>
            <span class="name">进入抽奖</span>
        </button>
        <button class="button" id="start_lottery">
            <span class="state">Loading...</span>
            <span class="name">开始抽奖</span>
        </button>
        <button class="button" id="quit_lottery">
            <span class="state">Loading...</span>
            <span class="name">退出抽奖</span>
        </button>
        <button class="button stop_lottery" id="stop_lottery">
            <span class="state">Loading...</span>
            <span class="name">停止抽奖</span>
        </button>
        <button class="button" id="confirm_lottery">
            <span class="state">Loading...</span>
            <span class="name">确定抽奖</span>
        </button>
        <button class="button" id="cancel_lottery">
            <span class="state">Loading...</span>
            <span class="name">取消抽奖</span>
        </button>
    </div>
</div>
<script src="/static/js/api.js"></script>
<script src="/static/js/index.js"></script>
</body>
</html>


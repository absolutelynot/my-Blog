"use strict"

window.onload = function(){
    create_img();
    document.getElementById("shufflebutton").addEventListener("click", shuffle);
}

var blank_x = 4;
var blank_y = 4;
var step = 0;
/* 产生拼图 */
function create_img(){
    var box = document.getElementById("puzzlearea");
    for(var i = 1; i < 5; ++i){
        for(var j = 1; j < 5; ++j){
            var temp = document.createElement("div");
            temp.addEventListener("click", img_move);
            temp.innerHTML = ( i - 1 ) * 4 + j;
            temp.className = "each_puzzle row_" + i + " col_"+j;
            temp.id = "_img_" + i + "_" + j;
            box.appendChild(temp);
        }
    }
    document.getElementById("_img_4_3").className += " can_move";
    document.getElementById("_img_3_4").className += " can_move";
}

function img_move(event){
    var row = parseInt(this.className.split("row_")[1]);
    var col = parseInt(this.className.split("col_")[1]);
    // 判断点击的图片是否与空格块相邻
    if((Math.abs(row - blank_x) == 1 && col == blank_y)||(Math.abs(col - blank_y) == 1 && row == blank_x)){
        var blank = document.getElementsByClassName("row_" + blank_x + " col_" + blank_y)[0].className;
        document.getElementsByClassName("row_" + blank_x + " col_" + blank_y)[0].className = this.className;
        this.className = blank;
        change_w();
        blank_x = row;
        blank_y = col; 
        change_r();

        step++;
        changeStep();
    }
    //检查是否还原原图
    if(check()) alert("You Win! Your steps are: "+step);
}

// 将 红色 恢复到 白色
function change_w(){
    var all = document.querySelectorAll(".can_move");
    for(var i = 0; i < all.length; ++i){
        var name = all[i].className;
        all[i].className = name.substring(0, name.indexOf(" can"));
    }
}

// 将周围可移动块变为 红色
function change_r(){
    var x = blank_x - 1;
    if(x > 0){
        document.getElementsByClassName("row_" + x + " col_" + blank_y)[0].className += " can_move";
    }
    x = blank_x + 1;
    if(x < 5){
        document.getElementsByClassName("row_" + x + " col_" + blank_y)[0].className += " can_move";
    }
    var y = blank_y - 1;
    if(y > 0 ){
        document.getElementsByClassName("row_" + blank_x + " col_" + y)[0].className += " can_move";
    }
    var y = blank_y + 1;
    if(y < 5 ){
        document.getElementsByClassName("row_" + blank_x + " col_" + y)[0].className += " can_move";
    }
}

//检查是否还原原图
function check(){
    for(var i = 1; i < 5; ++i){
        for(var j = 1; j < 5; ++j){
            var temp = document.getElementById("_img_" + i + "_" + j);
            var row = parseInt(temp.className.split("row_")[1]);
            var col = parseInt(temp.className.split("col_")[1]);

            if(row != i || col != j)    return false;
        }
    }
    return true;
}

//生成随机拼图
function shuffle(event){
    change_w();
    for(var i = 0; i < 1000; ++i){
        var neighbor = [];
        if(blank_x - 1 > 0) neighbor.push([blank_x - 1, blank_y]);
        if(blank_x + 1 < 5) neighbor.push([blank_x + 1, blank_y]);
        if(blank_y - 1 > 0) neighbor.push([blank_x, blank_y - 1]);
        if(blank_y + 1 < 5) neighbor.push([blank_x, blank_y + 1]);

        var rand = parseInt(neighbor.length*Math.random());
        var row = neighbor[rand][0];
        var col = neighbor[rand][1];
        var blank = document.getElementsByClassName("row_" + blank_x + " col_" + blank_y)[0];
        var move = document.getElementsByClassName("row_" + row + " col_" + col)[0];
        var blank_name = blank.className;

        blank.className = move.className;
        move.className = blank_name;
        blank_x = row;
        blank_y = col; 
    }
    if(check()) shuffle();
    change_r();

    step = 0;
    changeStep();
}

//显示步数
function changeStep(){
    document.getElementById("step").innerHTML = step;
}


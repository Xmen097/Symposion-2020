"use strict"

function random(start, end) { // both inclusive
    return Math.floor((Math.random() * (end+start-1)) + start);
}

function vec2(x, y) {
    return {"x": x === undefined ? 0 : x, "y": y === undefined ? 0 : y};
}

function dist(a, b) {
    return norm(vec2(a.x-b.x, a.y-b.y));
}

function norm(v) {
    return Math.sqrt((v.x)**2 + (v.y)**2);
}

function normalized(v) {
    let n = norm(v);
    return vec2(v.x/n, v.y/n);
}

class Bug {
    static bugs = [];

    constructor(width, height) {
        this.x = random(-border_spawn_margin, width+border_spawn_margin);
        this.y = random(-border_spawn_margin, height+border_spawn_margin);
        this.type = random(0, 4);
        this.img_ref = image_ref[this.type];
        this.angle = random(0, 2*Math.PI*1000)/1000;

        this.speed = random(10, 20)/10.0;
        this.velocity = vec2(this.speed*Math.cos(this.angle), this.speed*Math.sin(this.angle));
        this.scale = 1;

        this.vision = 200;
        this.separation = 0.001;
        this.alignment = 0.1;
        this.cohesion = 0.0005;

        Bug.bugs.push(this);
    }
    draw(canvas) {
        let w_to_h_ratio = this.img_ref.width / this.img_ref.height;

        //var x = this.x + this.scale/2;
        //var y = this.y+(this.scale/w_to_h_ratio)/2;

        canvas.setTransform(this.scale, 0, 0, this.scale, this.x, this.y);
        canvas.rotate(this.angle);
        canvas.drawImage(this.img_ref, -this.img_ref.width / 2, -this.img_ref.height / 2);

        this.update();
    }
    update() {
        let steer = vec2();

        let pos_sum = vec2();
        let dis_sum = vec2();
        let vel_sum = vec2();
        let num = 0;
        Bug.bugs.forEach((bug) => {
            if (this == bug) {
                return;
            }
            if (dist(this, bug) < this.vision) {
                pos_sum.x += bug.x;
                pos_sum.y += bug.y;
                dis_sum.x += bug.x-this.x;
                dis_sum.y += bug.y-this.y;
                vel_sum.x += normalized(bug.velocity).x;
                vel_sum.y += normalized(bug.velocity).y;
                num += 1;
            }
        });
        if (num > 0) {
            steer.x -= dis_sum.x/num * this.separation;
            steer.y -= dis_sum.y/num * this.separation;
            steer.x += vel_sum.x/num * this.alignment;
            steer.y += vel_sum.y/num * this.alignment;
            steer.x += (pos_sum.x/num - this.x) * this.cohesion;
            steer.y += (pos_sum.x/num - this.x) * this.cohesion;
        }

        this.velocity.x += steer.x;
        this.velocity.y += steer.y;

        this.velocity = normalized(this.velocity);
        this.velocity.x *= this.speed;
        this.velocity.y *= this.speed;

        this.angle = Math.atan2(this.velocity.y, this.velocity.x)
        
        this.x = (this.x+this.velocity.x+border_spawn_margin)%(width+border_spawn_margin)-border_spawn_margin;
        this.y = (this.y+this.velocity.y+border_spawn_margin)%(height+border_spawn_margin)-border_spawn_margin;

        if (this.x+border_spawn_margin < 0) {
            this.x = width-10;
        }
        if (this.y+border_spawn_margin < 0) {
            this.y = height-10;
        }
    }
}

let canvas_element;
let canvas;

let width;
let height;

let bug0 = new Image();
let bug1 = new Image();
let bug2 = new Image();
let bug3 = new Image();
let bug4 = new Image();

let border_spawn_margin = 200;

let image_ref = [bug0, bug1, bug2, bug3, bug4];

window.onload = function() {
    bug0.src = 'static/img/bg/0.png';
    bug1.src = 'static/img/bg/1.png';
    bug2.src = 'static/img/bg/2.png';
    bug3.src = 'static/img/bg/3.png';
    bug4.src = 'static/img/bg/4.png';
    canvas_element = document.getElementById('bugs');
    width = canvas_element.scrollWidth;
    height = canvas_element.scrollHeight;
    canvas = canvas_element.getContext("2d");
    canvas_element.width = width;
    canvas_element.height = height;
    let bug_count = 200;
    for (let a=0; a<bug_count; a++)
        new Bug(width, height);
    draw();
};

function draw() {
    canvas.save();
    canvas.fillStyle = '#00324b';
    canvas.fillRect(0, 0, width, height);
    Bug.bugs.forEach(bug => bug.draw(canvas));
    canvas.restore();
    window.requestAnimationFrame(draw);
}

window.onresize = function() {
    width = canvas_element.scrollWidth;
    height = canvas_element.scrollHeight;
    canvas_element.width = canvas_element.scrollWidth;
    canvas_element.style.width = canvas_element.scrollWidth;
    canvas_element.height = canvas_element.scrollHeight;
    canvas_element.style.height = canvas_element.scrollHeight;
}

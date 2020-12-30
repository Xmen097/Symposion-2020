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
function get_scale(val) {
  /*return Math.log(val) / Math.log(scaling_factor);*/
    return Math.pow(val, 1/scaling_factor);
}

class Bug {
    static bugs = [];

    constructor() {
        this.x = random(0, width);
        this.y = random(0, chaos_height);
        this.type = random(0, 4);
        this.img_ref = image_ref[this.type];
        this.angle = random(0, 2*Math.PI*1000)/1000;

        this.speed = random(7, 12)/10.0;
        this.velocity = vec2(this.speed*Math.cos(this.angle), this.speed*Math.sin(this.angle));

        this.vision = 200;
        this.separation = 0.001;
        this.alignment = 0.015;
        this.cohesion = 0.0005;
        this.fear = 0.01;

        Bug.bugs.push(this);
    }
    draw(canvas) {
        canvas.setTransform(scale, 0, 0, scale, this.x, this.y);
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
            if (dist(this, bug) < this.vision*scale) {
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
        let border_velocity = vec2();
        border_velocity.x = Math.log(Math.max(border_repulsion_margin-this.x, this.x-(width-border_repulsion_margin), 0)/200+1)**4 * (border_repulsion_margin-this.x > 0 ? 1 : -1);
        border_velocity.y = Math.log(Math.max(border_repulsion_margin-this.y, this.y-(chaos_height-border_repulsion_margin), 0)/200+1)**4 * (border_repulsion_margin-this.y > 0 ? 1 : -1);

        /*if (mouse.x != null && mouse.y != null && dist(mouse, this) < this.vision) {
            steer.x -= (mouse.x-this.x) * this.fear;
            steer.y -= (mouse.y-this.y) * this.fear;
        }*/

        this.velocity.x += steer.x+border_velocity.x;
        this.velocity.y += steer.y+border_velocity.y;
        
        this.velocity = normalized(this.velocity);
        this.velocity.x *= this.speed * scale;
        this.velocity.y *= this.speed * scale;

        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

let canvas_element;
let canvas;

let width;
let chaos_height;
let height;

let mouse = vec2(null, null);

let bug0 = new Image();
let bug1 = new Image();
let bug2 = new Image();
let bug3 = new Image();
let bug4 = new Image();

let border_repulsion_margin = 200;
let bug_density = 5;
let scale;
let scaling_factor = 3;
let lin_scaling_factor = 25;
let bug_count;

let image_ref = [bug0, bug1, bug2, bug3, bug4];

window.onload = function() {
    bug0.src = 'static/img/bg/0.png';
    bug1.src = 'static/img/bg/1.png';
    bug2.src = 'static/img/bg/2.png';
    bug3.src = 'static/img/bg/3.png';
    bug4.src = 'static/img/bg/4.png';
    canvas_element = document.getElementById('bugs');
    width = canvas_element.scrollWidth;
    chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)*1.40;
    height = canvas_element.scrollHeight;
    canvas = canvas_element.getContext("2d");
    canvas_element.width = width;
    canvas_element.height = height;
    scale = get_scale((width*chaos_height / 200**2)/(lin_scaling_factor));
    bug_count = (width*chaos_height / (200*scale)**2) * bug_density;
    for (let a=0; a<bug_count; a++)
        new Bug();
    draw();

    canvas_element.addEventListener('mousemove', function(evt) {
        let rect = canvas_element.getBoundingClientRect();
        mouse = vec2(evt.clientX - rect.left, evt.clientY - rect.top);
        console.log(mouse);
    });
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
    chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)*1.40;
    height = canvas_element.scrollHeight;
    canvas_element.width = width;
    canvas_element.style.width = width;
    canvas_element.height = height;
    canvas_element.style.height = height;
    scale = get_scale((width*chaos_height / 200**2)/(lin_scaling_factor));
    bug_count = (width*chaos_height / (200*scale)**2) * bug_density;
    Bug.bugs = [];
    for (let a=0; a<bug_count; a++)
        new Bug();
};

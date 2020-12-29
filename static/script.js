function random(start, end) { // both inclusive
    return Math.floor((Math.random() * (end+start-1)) + start);
}

class Bug {
    constructor(width, height) {
        this.x = random(-border_spawn_margin, width+border_spawn_margin);
        this.y = random(-border_spawn_margin, height+border_spawn_margin);
        this.type = random(0, 4);
        this.img_ref = image_ref[this.type];
        this.angle = random(0, 2*Math.PI*1000)/1000;
        this.velocity_x = Math.cos(this.angle);
        this.velocity_y = Math.sin(this.angle);
        this.velocity = random(5, 15)/10.0;
        this.scale = 200;
    }
    draw() {
        let w_to_h_ratio = this.img_ref.width / this.img_ref.height;

        var x = this.x + this.scale/2;
        var y = this.y+(this.scale/w_to_h_ratio)/2;
        canvas.translate(x, y);
        canvas.rotate(this.angle);

        canvas.drawImage(this.img_ref, this.x, this.y, this.scale, this.scale/w_to_h_ratio);

        canvas.rotate(-this.angle);
        canvas.translate(-x, -y);
        this.update();
    }
    update() {
        this.x = (this.x+this.velocity+border_spawn_margin)%(width+border_spawn_margin)-border_spawn_margin
        /*
        this.x = (this.x+this.velocity_x*this.velocity+border_spawn_margin)%(width+border_spawn_margin)-border_spawn_margin;
        this.y = (this.y+this.velocity_y*this.velocity+border_spawn_margin)%(width+border_spawn_margin)-border_spawn_margin;
        */
    }
}

let canvas_element;
let canvas;
let bugs = [];

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
    let bug_count = 500;
    for (let a=0; a<bug_count; a++)
        bugs.push(new Bug(width, height));
    draw();
};

function draw() {
    canvas.fillStyle = '#00324b';
    canvas.fillRect(0, 0, width, height);
    bugs.forEach(bug => bug.draw());
    window.requestAnimationFrame(draw);
}

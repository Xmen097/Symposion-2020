"use strict";

function random(start, end) { // both inclusive
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function vec2(x, y) {
    return {"x": x === undefined ? 0 : x, "y": y === undefined ? 0 : y};
}

function dist(a, b) {
    return norm(vec2(a.x-b.x, a.y-b.y));
    //return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)
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

function scroll(location) {
    window.location = location
}

let chaos_bugs = [];

class Chaos_Bug {
    constructor(x, y , type, angle) {
        this.x = typeof x !== 'undefined' ? x : random(0, width);
        this.y = typeof y !== 'undefined' ? y : random(0, chaos_height);
        this.type = typeof type !== 'undefined' ? type : random(0, 4);
        this.img_ref = image_ref[this.type];
        this.angle = typeof angle !== 'undefined' ? angle : random(0, 2*Math.PI*1000)/1000;

        this.speed = random(7, 11)/10.0;
        this.velocity = vec2(this.speed*Math.cos(this.angle), this.speed*Math.sin(this.angle));

        this.vision = 200;
        this.separation = 0.001;
        this.alignment = 0.02;
        this.cohesion = 0.0005;
        this.fear = 1;

        this.dying = false; // set to true if bug is to die due to overcrowding

        chaos_bugs.push(this);
    }
    draw(canvas, fast=false) {
        canvas.setTransform(scale, 0, 0, scale, this.x, this.y);
        canvas.rotate(this.angle);
        canvas.drawImage(this.img_ref, -this.img_ref.width / 2, -this.img_ref.height / 2);

        if (!fast) {
            this.update();
        } else {
            this.fast_update();
        }
    }
    update() {
        let steer = vec2();

        let pos_sum = vec2();
        let dis_sum = vec2();
        let vel_sum = vec2();
        let num = 0;
        chaos_bugs.forEach((bug) => {
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
            steer.y += (pos_sum.y/num - this.y) * this.cohesion;
        }
        let border_velocity = vec2();
        if (extra_bug_count <= extra_bug_dying && !this.dying) {
            border_velocity.x = Math.log(Math.max(border_repulsion_margin-this.x, this.x-(width-border_repulsion_margin), 0)/border_repulsion_margin+1)**4 * (border_repulsion_margin-this.x > 0 ? 1 : -1);
            border_velocity.y = Math.log(Math.max(border_repulsion_margin-this.y, this.y-(chaos_height-border_repulsion_margin), 0)/border_repulsion_margin+1)**4 * (border_repulsion_margin-this.y > 0 ? 1 : -1);
        } else {
            if (!this.dying) {
                this.dying = true;
                extra_bug_dying+=1;
            } // attract to border
            border_velocity.x = Math.sqrt(Math.max(this.x, width-this.x)) * (this.x > width-this.x ? 1 : -1);
            border_velocity.y = Math.sqrt(chaos_height-this.y)*-1;
            if (width+200 < this.x || this.x < -200 || this.y < -200) {
                chaos_bugs.splice(chaos_bugs.indexOf(this), 1);
                extra_bug_dying-=1;
                extra_bug_count-=1;
            }
        }
        if (mouse.x != null && mouse.y != null && dist(mouse, this) < this.vision) {
            let fear_vec = normalized(vec2(mouse.x-this.x, mouse.y-this.y));
            steer.x -= fear_vec.x * this.fear;
            steer.y -= fear_vec.y * this.fear;
        }

        this.velocity.x += steer.x+border_velocity.x;
        this.velocity.y += steer.y+border_velocity.y;
        
        this.velocity = normalized(this.velocity);
        this.velocity.x *= this.speed * scale;
        this.velocity.y *= this.speed * scale;

        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    fast_update() {
        let steer = vec2();

        let border_velocity = vec2();
        if (extra_bug_count <= extra_bug_dying && !this.dying) {
            border_velocity.x = Math.log(Math.max(border_repulsion_margin-this.x, this.x-(width-border_repulsion_margin), 0)/border_repulsion_margin+1)**4 * (border_repulsion_margin-this.x > 0 ? 1 : -1);
            border_velocity.y = Math.log(Math.max(border_repulsion_margin-this.y, this.y-(chaos_height-border_repulsion_margin), 0)/border_repulsion_margin+1)**4 * (border_repulsion_margin-this.y > 0 ? 1 : -1);
        } else {
            if (!this.dying) {
                this.dying = true;
                extra_bug_dying+=1;
            } // attract to border
            border_velocity.x = Math.sqrt(Math.max(this.x, width-this.x)) * (this.x > width-this.x ? 1 : -1);
            border_velocity.y = Math.sqrt(chaos_height-this.y)*-1;
            if (width+200 < this.x || this.x < -200 || this.y < -200) {
                chaos_bugs.splice(chaos_bugs.indexOf(this), 1);
                extra_bug_dying-=1;
                extra_bug_count-=1;
            }
        }
        if (mouse.x != null && mouse.y != null && dist(mouse, this) < this.vision) {
            let fear_vec = normalized(vec2(mouse.x-this.x, mouse.y-this.y));
            steer.x -= fear_vec.x * this.fear;
            steer.y -= fear_vec.y * this.fear;
        }

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

let stream_bugs = [];
let SB_spawn_cooldown = 180;
let SB_spawn_timeout = 0;
let SB_speed = -1;

class Stream_Bug {
    constructor(y) {
        this.y = typeof y !== 'undefined' ? y : height+100;
        this.type1 = random(0, 4);
        this.img_ref1 = image_ref[this.type1];
        this.type2 = random(0, 4);
        this.img_ref2 = image_ref[this.type2];
        this.angle = -Math.PI/2;

        this.velocity = vec2(0, 1);
        SB_spawn_timeout = SB_spawn_cooldown;

        stream_bugs.push(this);
    }
    draw(canvas) {
        canvas.setTransform(scale, 0, 0, scale, width-75, this.y);
        canvas.rotate(this.angle);
        canvas.drawImage(this.img_ref1, -this.img_ref1.width / 2, -this.img_ref1.height / 2);
        canvas.setTransform(scale, 0, 0, scale, width-200, this.y);
        canvas.rotate(this.angle);
        canvas.drawImage(this.img_ref2, -this.img_ref2.width / 2, -this.img_ref2.height / 2);

        this.update();
    }
    update() {
        this.y += SB_speed * scale;
        if (this.y < chaos_height) {
            let bug1 = new Chaos_Bug(width-75, this.y, this.type1, this.angle);
            let bug2 = new Chaos_Bug(width-200, this.y, this.type2, this.angle);
            bug1.draw(canvas);
            bug2.draw(canvas);
            extra_bug_count += 2;
            stream_bugs.shift();
            stream_bugs[0].draw(canvas);
        }
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

let border_repulsion_margin;
let bug_density = 5;
let scale;
let scaling_factor = 3;
let lin_scaling_factor = 50;
let max_bug_count;
let extra_bug_count = 0;
let extra_bug_dying = 0;

let image_ref = [bug0, bug1, bug2, bug3, bug4];

//fps counter stuff
let frames_to_stabilize = 10;
let frames_elapsed = 0;
let max_frame_time = 150; // replace with solid img if less than 10 frames
let too_slow = 0;
let filterStrength = 20;
let frameTime = 0, lastLoop = Date.now(), thisLoop;

window.onload = function() {
    bug0.src = static_url + 'img/bg/0.png';
    bug1.src = static_url + 'img/bg/1.png';
    bug2.src = static_url + 'img/bg/2.png';
    bug3.src = static_url + 'img/bg/3.png';
    bug4.src = static_url + 'img/bg/4.png';
    canvas_element = document.getElementById('bugs');
    width = canvas_element.scrollWidth;
    chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    border_repulsion_margin = chaos_height/5.0;
    height = canvas_element.scrollHeight;
    canvas = canvas_element.getContext("2d");
    canvas_element.width = width;
    canvas_element.height = height;
    scale = get_scale((width*chaos_height / 200**2)/(lin_scaling_factor));
    max_bug_count = (width*chaos_height / (200*scale)**2) * bug_density;
    for (let a=0; a<max_bug_count; a++)
        new Chaos_Bug();
    for (let y=chaos_height; y<height+100; y-=SB_spawn_cooldown*SB_speed)
        new Stream_Bug(y);
    draw();

    window.addEventListener('mousemove', function(evt) {
        let rect = canvas_element.getBoundingClientRect();
        mouse = vec2(evt.clientX - rect.left, evt.clientY - rect.top);
    });
};

function draw() {
    if (too_slow === 0) {
        canvas.save();
        canvas.fillStyle = '#00324b';
        canvas.fillRect(0, 0, width, height);
        chaos_bugs.forEach(bug => bug.draw(canvas));
        stream_bugs.forEach(bug => bug.draw(canvas));
        if (SB_spawn_timeout === 0) {
            new Stream_Bug();
        } else
            SB_spawn_timeout--;
        canvas.restore();
        if (frames_elapsed < frames_to_stabilize) {
            let thisFrameTime = (thisLoop=Date.now()) - lastLoop;
            frameTime+= (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
            frames_elapsed++;
        } else if (frameTime > max_frame_time) {
            too_slow=1;
            frames_elapsed = 0;
        }
    } else if (too_slow === 1) {
        canvas.save();
        canvas.fillStyle = '#00324b';
        canvas.fillRect(0, 0, width, height);
        chaos_bugs.forEach(bug => bug.draw(canvas, true)); // fast update
        stream_bugs.forEach(bug => bug.draw(canvas));
        if (SB_spawn_timeout === 0) {
            new Stream_Bug();
        } else
            SB_spawn_timeout--;
        canvas.restore();
        if (frames_elapsed < frames_to_stabilize) {
            let thisFrameTime = (thisLoop=Date.now()) - lastLoop;
            frameTime+= (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
            frames_elapsed++;
        } else if (frameTime > max_frame_time) {
            too_slow=2;
            frames_elapsed = 0;
        }
    } else {

    }
    window.requestAnimationFrame(draw);
}

window.onresize = function() {
    width = canvas_element.scrollWidth;
    chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    height = canvas_element.scrollHeight;
    border_repulsion_margin = chaos_height/5.0;
    canvas_element.width = width;
    canvas_element.style.width = width;
    canvas_element.height = height;
    canvas_element.style.height = height;
    scale = get_scale((width*chaos_height / 200**2)/(lin_scaling_factor));
    max_bug_count = (width*chaos_height / (200*scale)**2) * bug_density;
    chaos_bugs = [];
    for (let a=0; a<max_bug_count; a++)
        new Chaos_Bug();
};

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

function mobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

let chaos_bugs = [];

class Chaos_Bug {
    constructor(x, y , type, angle) {
        this.x = typeof x !== 'undefined' ? x : random(0, width);
        this.y = typeof y !== 'undefined' ? y : random(0, chaos_height);
        this.type = typeof type !== 'undefined' ? type : random(0, 4);
        this.img_ref = image_ref[this.type];
        this.currect_animation_frame = random(0, frames_per_animation);
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
        let img = this.img_ref[Math.floor(this.currect_animation_frame/frames_per_animation)%this.img_ref.length];
        this.currect_animation_frame++;
        canvas.drawImage(img, -img.width / 2, -img.height / 2);

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
        this.currect_animation_frame = 0;
        this.velocity = vec2(0, 1);
        SB_spawn_timeout = SB_spawn_cooldown;

        stream_bugs.push(this);
    }
    draw(canvas) {
        canvas.setTransform(scale, 0, 0, scale, width-75, this.y);
        canvas.rotate(this.angle);
        let img1 = this.img_ref1[Math.floor(this.currect_animation_frame/frames_per_animation)%this.img_ref1.length];
        canvas.drawImage(img1, -img1.width / 2, -img1.height / 2);
        canvas.setTransform(scale, 0, 0, scale, width-200, this.y);
        canvas.rotate(this.angle);
        let img2 = this.img_ref2[Math.floor(this.currect_animation_frame/frames_per_animation)%this.img_ref2.length];
        canvas.drawImage(img2, -img2.width / 2, -img2.height / 2);

        this.currect_animation_frame++;
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

let bug0 = [new Image(), new Image(), new Image()];
let bug1 = [new Image(), new Image(), new Image()];
let bug2 = [new Image(), new Image(), new Image()];
let bug3 = [new Image(), new Image()];
let bug4 = [new Image(), new Image(), new Image()];

let border_repulsion_margin;
let bug_density = 5;
let scale;
let scaling_factor = 3;
let lin_scaling_factor = 50;
let max_bug_count;
let extra_bug_count = 0;
let extra_bug_dying = 0;

let image_ref = [bug0, bug1, bug2, bug3, bug4];
let frames_per_animation = 30;

//fps counter stuff
let max_stabilization_frames = 20;
let stabilization_frames = 0;
let stabilization = 15;
let stabilization_threshold = 6;
let stabilization_failed = 0;
let frames_elapsed = 0;
let max_frame_time = 100; // maximum frame_time
let too_slow = 0;
let filterStrength = 5;
let frameTime = 0, lastLoop = Date.now(), thisLoop;


window.onload = function() {
    bug0[0].src = static_url + 'img/bg/hnusak1.png';
    bug0[1].src = static_url + 'img/bg/hnusak2.png';
    bug0[2].src = static_url + 'img/bg/hnusak3.png';
    bug1[0].src = static_url + 'img/bg/hovnival1.png';
    bug1[1].src = static_url + 'img/bg/hovnival2.png';
    bug1[2].src = static_url + 'img/bg/hovnival3.png';
    bug2[0].src = static_url + 'img/bg/chroust1.png';
    bug2[1].src = static_url + 'img/bg/chroust2.png';
    bug2[2].src = static_url + 'img/bg/chroust3.png';
    bug3[0].src = static_url + 'img/bg/modrmura1.png';
    bug3[1].src = static_url + 'img/bg/modrmura2.png';
    bug4[0].src = static_url + 'img/bg/mura1.png';
    bug4[1].src = static_url + 'img/bg/mura2.png';
    bug4[2].src = static_url + 'img/bg/mura3.png';
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
    //if (mobile())
    //    too_slow = 2;

    window.addEventListener('mousemove', function(evt) {
        let rect = canvas_element.getBoundingClientRect();
        mouse = vec2(evt.clientX - rect.left, evt.clientY - rect.top);
    });
};

function draw(f, forced=false) {
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
        if (stabilization_failed < stabilization_threshold && stabilization_frames < max_stabilization_frames) {
            let thisFrameTime = (thisLoop=Date.now()) - lastLoop;
            let deltaFrame = frameTime - thisFrameTime;
            frameTime+= (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
            stabilization_frames++;
            if (deltaFrame < stabilization)
                stabilization_failed++;
        } else if (frameTime > max_frame_time) {
            too_slow=1;
            alert(frameTime+" "+stabilization_failed+" "+stabilization_frames)
            stabilization_failed = 0;
        } else {
            alert(frameTime)
        }
    } else if (too_slow === 1 || forced) {
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
        if (stabilization_failed < stabilization_threshold && stabilization_frames < max_stabilization_frames) {
            let thisFrameTime = (thisLoop=Date.now()) - lastLoop;
            let deltaFrame = frameTime - thisFrameTime;
            frameTime+= (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
            stabilization_frames++;
            if (deltaFrame < stabilization_threshold)
                stabilization_failed++;
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
    draw(0, true)
};

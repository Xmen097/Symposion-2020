"use strict";

var config = {
	num: 100,
	speed: 0.1,
	scale: 1,
	anim_period: 500,

	vision: 200,
	fear: 0.2,

	width: undefined,
	height: undefined,

	border_repulsion_margin: undefined,
	border_repulsion: 1,
}
var bugs = [];
var ctx, canvas;
var prev;
var mouse = {"x": null, "y": null}

var tex = [
	[new Image(), new Image(), new Image()], 
	[new Image(), new Image(), new Image()], 
	[new Image(), new Image(), new Image()], 
	[new Image(), new Image()], 
	[new Image(), new Image(), new Image()]
];

function loop(time) {
	// Calc delta
	if (prev === undefined) {
		prev = time;
	}
	const delta = time-prev;

	// Update
	for (var i = 0; i < config.num; i++) {
		bugs[i].x += bugs[i].dx*config.speed*delta;
		bugs[i].y += bugs[i].dy*config.speed*delta;
        
        bugs[i].dx += Math.log(Math.max(config.border_repulsion_margin-bugs[i].x, bugs[i].x-(config.width-config.border_repulsion_margin), 0)/config.border_repulsion_margin+1)**2 * (config.border_repulsion_margin-bugs[i].x > 0 ? 1 : -1);
        bugs[i].dy += Math.log(Math.max(config.border_repulsion_margin-bugs[i].y, bugs[i].y-(config.height-config.border_repulsion_margin), 0)/config.border_repulsion_margin+1)**2 * (config.border_repulsion_margin-bugs[i].y > 0 ? 1 : -1);

        if (mouse.x != null && mouse.y != null && Math.sqrt((mouse.x-bugs[i].x)**2 + (mouse.y-bugs[i].y)**2) < config.vision) {
            bugs[i].dx += (bugs[i].x-mouse.x)*config.fear;
            bugs[i].dy += (bugs[i].y-mouse.y)*config.fear;
        }

		let c = Math.sqrt(bugs[i].dx**2 + bugs[i].dy**2);
		bugs[i].dx /= c;
		bugs[i].dy /= c;
	}

	// Draw
    ctx.clearRect(0, 0, config.width, config.height);

    ctx.save();
    for (var i = 0; i < config.num; i++) {
    	ctx.setTransform(config.scale, 0, 0, config.scale, Math.floor(bugs[i].x), Math.floor(bugs[i].y));
        ctx.rotate(Math.atan2(bugs[i].dy, bugs[i].dx));

        let imgs = tex[bugs[i].type];
        let img = imgs[Math.floor((time/config.anim_period + bugs[i].offset)%imgs.length)];

        ctx.drawImage(img, Math.floor(-img.width / 2), Math.floor(-img.height / 2));
    }
    ctx.restore();

    // Next frame
	prev = time;
    window.requestAnimationFrame(loop);
}

function load_textures() {
	tex[0][0].src = static_url + 'img/bg/hnusak1.png';
    tex[0][1].src = static_url + 'img/bg/hnusak2.png';
    tex[0][2].src = static_url + 'img/bg/hnusak3.png';
    tex[1][0].src = static_url + 'img/bg/hovnival1.png';
    tex[1][1].src = static_url + 'img/bg/hovnival2.png';
    tex[1][2].src = static_url + 'img/bg/hovnival3.png';
    tex[2][0].src = static_url + 'img/bg/chroust1.png';
    tex[2][1].src = static_url + 'img/bg/chroust2.png';
    tex[2][2].src = static_url + 'img/bg/chroust3.png';
    tex[3][0].src = static_url + 'img/bg/modrmura1.png';
    tex[3][1].src = static_url + 'img/bg/modrmura2.png';
    tex[4][0].src = static_url + 'img/bg/mura1.png';
    tex[4][1].src = static_url + 'img/bg/mura2.png';
    tex[4][2].src = static_url + 'img/bg/mura3.png';
}

window.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    mouse = {"x": evt.clientX - rect.left, "y": evt.clientY - rect.top};
});

window.addEventListener("load", function() {
	load_textures();

	canvas = document.getElementById('bugs');
    var width = canvas.scrollWidth;
    var chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    //var height = canvas.scrollHeight;

    canvas.width = width;
    canvas.height = chaos_height;

    config.width = width;
    config.height = chaos_height;
    config.border_repulsion_margin = Math.min(width/10.0, chaos_height/5.0)/2;

    ctx = canvas.getContext("2d");

    for (var i = 0; i < config.num; i++) {
    	var ang = Math.random()*2*Math.PI;
    	bugs[i] = {
    		"x": Math.random() * config.width, 
    		"y": Math.random() * config.height, 
    		"dx": Math.cos(ang), 
    		"dy": Math.sin(ang),
    		"offset": Math.random(),
    		"type": Math.floor(Math.random() * 5),
    	};
    }

    window.requestAnimationFrame(loop);
});

window.onresize = function() {
    var width = canvas.scrollWidth;
    var chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    canvas.width = width;
    canvas.height = chaos_height;
    config.width = width;
    config.height = chaos_height;
    config.border_repulsion_margin = Math.min(width/10.0, chaos_height/5.0)/2;

    max_bug_count = (width*chaos_height / (200*scale)**2) * bug_density;
};


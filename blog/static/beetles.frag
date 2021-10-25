#define BUG_COUNT 100
#define START_TIME 6790.654
#define SLOWNESS 10.

#ifdef GL_ES
precision mediump float;
#endif


uniform float u_time;
uniform vec2 u_resolution;

uniform float u_chaos_height;
uniform sampler2D u_tex[1];


vec3 direction(int id) {
	float ang = float(id) * 1.5796;
	return vec3(cos(ang), sin(ang), ang);
}


vec2 pos(int id) {
	return fract(direction(id).xy*(u_time/SLOWNESS + START_TIME));
}


void main() {
	vec4 color = vec4(0.066, 0.196, 0.286, 1.);

	vec2 uv = vec2(gl_FragCoord.x, gl_FragCoord.y)/u_resolution;
	uv.y *= u_resolution.y/u_resolution.x;

	for (int i = 0; i < BUG_COUNT; i++) {
		if (distance(uv, pos(i)) < 0.01) {
			color = vec4(1., 0., 0., 1.);//texture2D(u_tex[0], pos(i)-uv);
		}
	}

	gl_FragColor = color;
}
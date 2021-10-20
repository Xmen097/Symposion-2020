var sandbox;

window.addEventListener("load", function() {
	var canvas = document.getElementById('bugs');
    var width = canvas.scrollWidth;
    var chaos_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    //var height = canvas.scrollHeight;

    canvas.width = width;
    canvas.height = chaos_height;

    sandbox = new glsl.Canvas(canvas, {});

    sandbox.on("render", function() {
		sandbox.setUniform("u_chaos_height", chaos_height);
	});
})
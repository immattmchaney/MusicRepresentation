//Experimenting with namespaces
var NoteM = {};
NoteM.Const = {};

NoteM.Const.EndFadeOut = 20;
NoteM.Const.StartFadeOut = 60;
NoteM.Const.EndFadeIn = 840;
NoteM.Const.StartFadeIn = 880;
NoteM.Const.BPM = 200; //Currently has nothing to do with actual BPM
NoteM.Const.NoteWidth = 15;
NoteM.Const.NoteHeightToWidth = 0.75;


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();


function animate(myNote, canvas, context, startTime) {
	// update
	var time = (new Date()).getTime();

	var elapsedTime = time - startTime;
	
	myNote.update(elapsedTime);
	
	startTime = time;

	// clear
	context.clearRect(0, 0, canvas.width, canvas.height);

	myNote.draw(context);

	// request new frame
	requestAnimFrame(function() {
		animate(myNote, canvas, context, startTime);
	});
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

//More unnecessary namespace fluff
NoteM.Drawables = {};

//Still stuck in C# mind, hence the name
NoteM.Drawables.IDrawable = function () {};

NoteM.Drawables.IDrawable.prototype.x = 0;
NoteM.Drawables.IDrawable.prototype.y = 0;
NoteM.Drawables.IDrawable.prototype.a = 1;

NoteM.Drawables.IDrawable.prototype.draw = function() {
	alert(this.constructor + "'s draw function is not initialized!");
};

NoteM.Drawables.IDrawable.prototype.update = function() {
	alert(this.constructor + "'s update function is not initialized!");
};

NoteM.Drawables.Note = function () {
	this.type = "C5";
};

NoteM.Drawables.Note.prototype = new NoteM.Drawables.IDrawable();

NoteM.Drawables.Note.prototype.draw = function(context) {
	context.beginPath();
	context.save();
	context.scale(1, NoteM.Const.NoteHeightToWidth);
	context.globalAlpha = this.a;
	context.arc(this.x, this.y, NoteM.Const.NoteWidth, 0 , 2 * Math.PI, false);
	context.fillStyle = '#000000';
	context.fill();
	context.closePath();
	context.restore();
};

NoteM.Drawables.Note.prototype.update  = function(elapsedTime) {
	// pixels / second
	var newX = NoteM.Const.BPM * (elapsedTime) / 1000;

	this.x = this.x - newX;

	if(this.x <= 0)
	{
		this.x = this.x + 900;
	}

	this.a = (this.x <= NoteM.Const.StartFadeOut ? Math.max((NoteM.Const.EndFadeOut - this.x) / (NoteM.Const.EndFadeOut - NoteM.Const.StartFadeOut), 0) :
		(this.x >= NoteM.Const.EndFadeIn ? Math.max((NoteM.Const.StartFadeIn - this.x) / (NoteM.Const.StartFadeIn - NoteM.Const.EndFadeIn), 0) : 1));

};

var myNote = new NoteM.Drawables.Note();
myNote.y = 50;

// wait one second before starting animation
var startTime = (new Date()).getTime();
animate(myNote, canvas, context, startTime);
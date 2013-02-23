var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

//Experimenting with namespaces
var NoteM = {};
NoteM.Const = {};

NoteM.Const.EndFadeOut = 20;
NoteM.Const.StartFadeOut = 60;
NoteM.Const.EndFadeIn = 840;
NoteM.Const.StartFadeIn = 880;
NoteM.Const.BPM = 200; //Currently has nothing to do with actual BPM
NoteM.Const.NoteWidth = 10;
NoteM.Const.NoteHeightToWidth = 0.75;
NoteM.Const.NoteRotation = -.25; //radians
NoteM.Const.ExtraTopMeasureBar = 10;

NoteM.Const.LineWidth = 2;
NoteM.Const.LineSpacing = 15;
NoteM.Const.StartFromTop = 0.25;

//Doing colors for the gradient for the lines!
NoteM.Colors = {};
NoteM.Colors.StaffBar = context.createLinearGradient(NoteM.Const.EndFadeOut, 20, NoteM.Const.StartFadeIn, 20);
// light blue-
NoteM.Colors.StaffBar.addColorStop(0, 'rgba(0,0,0,0)');   
// dark blue
NoteM.Colors.StaffBar.addColorStop((NoteM.Const.StartFadeOut - NoteM.Const.EndFadeOut) / (NoteM.Const.StartFadeIn - NoteM.Const.EndFadeOut), 'rgba(0,0,0,256)');
// dark blue
NoteM.Colors.StaffBar.addColorStop((NoteM.Const.EndFadeIn - NoteM.Const.EndFadeOut) / (NoteM.Const.StartFadeIn - NoteM.Const.EndFadeOut), 'rgba(0,0,0,256)');
// light blue
NoteM.Colors.StaffBar.addColorStop(1, 'rgba(0,0,0,0)');   


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();


function animate(myNotes, myBars, canvas, context, startTime) {
	// update
	var time = (new Date()).getTime();

	var elapsedTime = time - startTime;
	
	for(var i = 0; i < myNotes.length; i++)
		myNotes[i].update(elapsedTime);
		
	for(var i = 0; i < myMeasures.length; i++)
		myMeasures[i].update(elapsedTime);
	
	startTime = time;

	// clear
	context.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < myNotes.length; i++)
		myNotes[i].draw(context);

	for(var i = 0; i < myBars.length; i++)
		myBars[i].draw(context);
		
	for(var i = 0; i < myMeasures.length; i++)
		myMeasures[i].draw(context);
	
	// request new frame
	requestAnimFrame(function() {
		animate(myNotes, myBars, canvas, context, startTime);
	});
}

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

NoteM.Drawables.RhythmicDrawable = function () {};

NoteM.Drawables.RhythmicDrawable.prototype = new NoteM.Drawables.IDrawable();

NoteM.Drawables.RhythmicDrawable.prototype.update = function(elapsedTime) {
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

NoteM.Drawables.MeasureBar = function (newX) {
	this.x = newX;
} 

NoteM.Drawables.MeasureBar.prototype = new NoteM.Drawables.RhythmicDrawable();

NoteM.Drawables.MeasureBar.prototype.draw = function(context) {
	context.fillStyle = NoteM.Colors.StaffBar;
	//NoteM.Const.ExtraTopMeasureBar
	context.fillRect(this.x -(NoteM.Const.LineWidth) / 2, 20 - NoteM.Const.ExtraTopMeasureBar, NoteM.Const.LineWidth, 80 + 2 * NoteM.Const.ExtraTopMeasureBar);
}

NoteM.Drawables.StaffBar = function (newY) {
	this.y = newY;
};

NoteM.Drawables.StaffBar.prototype = new NoteM.Drawables.IDrawable();

NoteM.Drawables.StaffBar.prototype.draw = function(context) {
	context.fillStyle = NoteM.Colors.StaffBar;
	
	context.fillRect(NoteM.Const.EndFadeOut, this.y, NoteM.Const.StartFadeIn - NoteM.Const.EndFadeOut, NoteM.Const.LineWidth);
}

NoteM.Drawables.Note = function () {
	this.type = "C5";
};

NoteM.Drawables.Note.prototype = new NoteM.Drawables.RhythmicDrawable();

NoteM.Drawables.Note.prototype.draw = function(context) {
	context.beginPath();
	context.save();
	context.translate(this.x, this.y);
	context.rotate(NoteM.Const.NoteRotation);
	context.scale(1, NoteM.Const.NoteHeightToWidth);
	context.globalAlpha = this.a;
	context.arc(NoteM.Const.NoteWidth / -2, NoteM.Const.NoteWidth / -2, NoteM.Const.NoteWidth, 0 , 2 * Math.PI, false);
	context.fillStyle = '#000000';
	context.fill();
	context.closePath();
	context.restore();
};





canvas.addEventListener( "keydown", doKeyDown, true);


function doKeyDown(e) {
//left - 37, right - 39
	if (e.keyCode == 37) {
		NoteM.Const.BPM -= 4;
	}
	if (e.keyCode == 39) {
		NoteM.Const.BPM += 4;
	}

}






var myNotes = [];

myNotes.push(new NoteM.Drawables.Note());
myNotes[0].y = 250;


var myMeasures = [];

myMeasures.push(new NoteM.Drawables.MeasureBar(300));

var myBars = [];

for(var j = 0; j < 5; j++)
{
	myBars.push(new NoteM.Drawables.StaffBar(20 + j * (NoteM.Const.LineSpacing + NoteM.Const.LineWidth)));
}

// wait one second before starting animation
var startTime = (new Date()).getTime();
animate(myNotes, myBars, canvas, context, startTime);
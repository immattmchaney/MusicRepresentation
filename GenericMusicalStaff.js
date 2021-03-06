if(typeof(GenericMusicalStaffInterface) == 'undefined')
{
	function GenericMusicalStaff (canvasName, canvasWidth, canvasHeight) {
	
		var canvas = document.getElementById(canvasName);
		if(canvas == null)
		{
			canvas = document.createElement('canvas');
			canvas.id = canvasName;
			var body = document.getElementsByTagName("body")[0];
			body.appendChild(canvas);
		}
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.tabIndex = 1;//Needs to be redone in the future
		//canvas.style.zIndex = 8; ???
		//canvas.style.position = "absolute";
		//canvas.style.border = "1px solid";
		canvas.style.backgroundColor = GenericMusicalStaffInterface.Colors.LightBlue;
		var context = canvas.getContext('2d');
		
		var _isPlaying = false;
		var _redraw = true;
		var _update = true;
		
		//Drag vars
		var _dragX = 0;
		var _dragMom = 0;
		
		var _totalMeasures = 10;
		var _currLoc = 0;
		var _newCurrLoc = 0; //Used for making sure _currLoc isn't overwritten mid-draw
		
		var _speed; //Set in the setMeasures
		setSpeed();
		
		this.Forward = function() {
			_currLoc += 5;
			_redraw = true;
		};
		
		this.Backward = function() {
			_currLoc -= 5;
			_redraw = true;
		};
		
		this.Play = function() {
			if(!_isPlaying)
			{
				_isPlaying = true;
				lastTime = (new Date()).getTime();
				_dragMom = 0;
				_redraw = true;
			}
			if(_currLoc == _totalMeasures * GenericMusicalStaffInterface.Var.MeasureWidth)
			{
				_currLoc = 0;
			}
		};
		
		this.Stop = function() {
			if(_isPlaying)
			{
				_isPlaying = false;
			}
		};
		
		this.SetBPM = function(bpm) {
			this.Var.BPM = bpm;
			setSpeed();
		};
		
		this.AddNote = function(note, measure, beat) {
			var x = GenericMusicalStaffInterface.Var.MeasureWidth * ((measure - 1) + (2 * beat - 1) / 8); //4:4 time rightnow permanently
			var y = GenericMusicalStaffInterface.getRelativeNote(note);
			myNotes.push(new GenericMusicalStaffInterface.Drawables.Note(note,x,y));
			
		//Find the location of the note via the current note
		
		
			_redraw = true;
		};
		
		function setSpeed() {
			_speed = GenericMusicalStaffInterface.Var.BPM / 60 / 4 * GenericMusicalStaffInterface.Var.MeasureWidth; //constant 4 beats per measure
		}
		
		var testNums1 = 0;
		var testNums2 = 4;
		
		this.SetStaffLines = function() {
			for(var j = 0; j < 5; j++)
			{
				myBars.push(new GenericMusicalStaffInterface.Drawables.StaffBar(GenericMusicalStaffInterface.Var.TopBar + j * GenericMusicalStaffInterface.Var.LineSpacing));
			}
			setSpeed();
		};
		
		this.ClearMeasures = function() {
			_totalMeasures = 0;
			myMeasures.length = 0;
		};
		
		this.SetMeasures = function(count) {
			this.ClearMeasures();
			this.SetStaffLines();
			_totalMeasures = count;
			for(var i = 0; i <= count; i++)
			{
				myMeasures.push(new GenericMusicalStaffInterface.Drawables.MeasureBar(i * GenericMusicalStaffInterface.Var.MeasureWidth));
			}
		};
		
		this.AddTestNote = function() {
			//generate between G5 and A4
			/*
			var note = GenericMusicalStaffInterface.Var.Notes[testNums1] + testNums2;
			myNotes.push(new GenericMusicalStaffInterface.Drawables.Note(note));
			testNums1++;
			if(testNums1 >= 7)
			{
				testNums1 -= 7;
				if(testNums2 == 4) testNums2 = 5;
				else testNums2 = 4;
			}*/
			_redraw = true;
		};
		
		this.ClearNotes = function() {
			//Is there a clear function?
			myNotes.length = 0;
			_redraw = true;
		};
		
		function animate() {
			if(!_isPlaying && _dragX == 0 && Math.abs(_dragMom) > 1)
			{
				_dragMom -= _dragMom * GenericMusicalStaffInterface.Var.DragFriction;
				_newCurrLoc += _dragMom;
				_redraw = true;
			}
			
			if(_redraw || _isPlaying)
			{
				//Get elapsed time
				var time = (new Date()).getTime();
				var elapsedTime = time - lastTime;
				
				//Clear
				context.clearRect(0, 0, canvas.width, canvas.height);
				
				if(_isPlaying)
					_newCurrLoc = _currLoc + elapsedTime * _speed / 1000;
				
				//Constrain currLoc
				if(_newCurrLoc != _currLoc)
				{
					_currLoc = _newCurrLoc;
					if(_currLoc < 0) _currLoc = 0;
					if(_currLoc > _totalMeasures * GenericMusicalStaffInterface.Var.MeasureWidth)
					{
						_currLoc = _totalMeasures * GenericMusicalStaffInterface.Var.MeasureWidth;
						_isPlaying = false;
					}
					_newCurrLoc = _currLoc;
				}

				//Draw the constant ones
				for(var i = 0; i < myBars.length; i++)
					myBars[i].draw(context,GenericMusicalStaffInterface.Var.CurrLocOffset - _currLoc, GenericMusicalStaffInterface.Var.CurrLocOffset+_totalMeasures * GenericMusicalStaffInterface.Var.MeasureWidth-_currLoc);
				
				context.save();
				
				//Update Camera
				context.translate(GenericMusicalStaffInterface.Var.CurrLocOffset-_currLoc,0);
				
				//Draw
				for(var i = 0; i < myMeasures.length; i++)
					myMeasures[i].draw(context);
				for(var i = 0; i < myNotes.length; i++)
					myNotes[i].draw(context);
					
				context.restore();
				
				curLocBar.draw(context);
			}
			
			
			//Set the new time
			lastTime = time;
			
			//if(!_isPlaying)
			_redraw = false;
			
			// request new frame
			requestAnimFrame(function() {
				animate();
			});
		}

		//Just a quick thing here
		var myNotes = [];
		var myMeasures = [];
		var myBars = [];
		
		var curLocBar = new GenericMusicalStaffInterface.Drawables.MeasureBar(GenericMusicalStaffInterface.Var.CurrLocOffset);
		curLocBar.color = GenericMusicalStaffInterface.Colors.Blue;
		curLocBar.extraHeight = true;
		
		this.testInit = function () {
			myNotes.push(new GenericMusicalStaffInterface.Drawables.Note("C5"));
			myNotes.push(new GenericMusicalStaffInterface.Drawables.Note("F5"));
			//myNotes.push(new GenericMusicalStaffInterface.Drawables.Note("F3"));
			//myNotes.push(new GenericMusicalStaffInterface.Drawables.Note("D6"));

			SetStaffLines();

			myMeasures.push(new GenericMusicalStaffInterface.Drawables.MeasureBar(300));

			
			_redraw = true;
		};
		
		
		//Dragging code
		function drag(e){
			_dragMom = _dragX - e.pageX;
			_newCurrLoc += _dragMom;
			_dragX = e.pageX;
			
			_redraw = true;
		}
		
		function onDown(e){
			event.preventDefault();
			
			canvas.focus();
			
			if(_isPlaying)
				_isPlaying = false;
			
			_dragX = e.pageX;
		
			canvas.onmousemove = drag;
		}

		function onUp(){
			_dragX = 0;
			canvas.onmousemove = null;
		}

		function onOut(){
			_dragX = 0;
			canvas.onmousemove = null;
		}
		
		canvas.onmousedown = onDown;
		canvas.onmouseup = onUp;
		canvas.onmouseout = onOut;
		
		this.GetCanvas = function() {
			return canvas;
		};
		
		// wait one second before starting animation
		var lastTime = (new Date()).getTime();
		animate();
	}


	//Experimenting with namespaces
	//function GenericMusicalStaffInterface() {}
	GenericMusicalStaffInterface = {};
	
	GenericMusicalStaff.prototype = GenericMusicalStaffInterface;
	
	GenericMusicalStaffInterface.Var = {};

	GenericMusicalStaffInterface.Var.EndFadeOut = 0;
	GenericMusicalStaffInterface.Var.StartFadeOut = 0;
	GenericMusicalStaffInterface.Var.EndFadeIn = 900;
	GenericMusicalStaffInterface.Var.StartFadeIn = 900;
	GenericMusicalStaffInterface.Var.BPM = 200; //Currently has nothing to do with actual BPM
	GenericMusicalStaffInterface.Var.NoteWidth = 10;
	GenericMusicalStaffInterface.Var.NoteHeightToWidth = 0.75;
	GenericMusicalStaffInterface.Var.NoteRotation = -.25; //radians
	GenericMusicalStaffInterface.Var.ExtraTopMeasureBar = 10;
	GenericMusicalStaffInterface.Var.TopBar = 100;
	GenericMusicalStaffInterface.Var.TopNote = "F5"; //note of top bar
	GenericMusicalStaffInterface.Var.MeasureWidth = 200;

	GenericMusicalStaffInterface.Var.LineWidth = 2;
	GenericMusicalStaffInterface.Var.LineSpacing = 16;
	GenericMusicalStaffInterface.Var.StartFromTop = 0.20;
	GenericMusicalStaffInterface.Var.ExtraLedgerLineLength = 10;
	GenericMusicalStaffInterface.Var.CurrLocOffset = 200
	
	GenericMusicalStaffInterface.Var.DragFriction = 0.1;

	//Doing colors for the gradient for the lines!
	//Taken out because context is needed to make these colors
	//GenericMusicalStaffInterface.Colors = {};
	//GenericMusicalStaffInterface.Colors.StaffBar = context.createLinearGradient(GenericMusicalStaffInterface.Var.EndFadeOut, 20, GenericMusicalStaffInterface.Var.StartFadeIn, 20);
	// light blue-
	//GenericMusicalStaffInterface.Colors.StaffBar.addColorStop(0, 'rgba(0,0,0,0)');   
	// dark blue
	//GenericMusicalStaffInterface.Colors.StaffBar.addColorStop((GenericMusicalStaffInterface.Var.StartFadeOut - GenericMusicalStaffInterface.Var.EndFadeOut) / (GenericMusicalStaffInterface.Var.StartFadeIn - GenericMusicalStaffInterface.Var.EndFadeOut), 'rgba(0,0,0,256)');
	// dark blue
	//GenericMusicalStaffInterface.Colors.StaffBar.addColorStop((GenericMusicalStaffInterface.Var.EndFadeIn - GenericMusicalStaffInterface.Var.EndFadeOut) / (GenericMusicalStaffInterface.Var.StartFadeIn - GenericMusicalStaffInterface.Var.EndFadeOut), 'rgba(0,0,0,256)');
	// light blue
	//GenericMusicalStaffInterface.Colors.StaffBar.addColorStop(1, 'rgba(0,0,0,0)');   

	GenericMusicalStaffInterface.Colors = {};
	GenericMusicalStaffInterface.Colors.Black = '#000000';
	GenericMusicalStaffInterface.Colors.White = '#FFFFFF';
	GenericMusicalStaffInterface.Colors.Grey = '#808080';
	GenericMusicalStaffInterface.Colors.LightBlue = '#BBCCFF';
	GenericMusicalStaffInterface.Colors.Blue = '#0000FF';

	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();



	//More unnecessary namespace fluff
	GenericMusicalStaffInterface.Drawables = {};

	//Still stuck in C# mind, hence the name
	GenericMusicalStaffInterface.Drawables.IDrawable = function () {};

	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.x = 0;
	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.y = 0;
	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.a = 1;
	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.color = GenericMusicalStaffInterface.Colors.Black;
	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.active = true;

	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.draw = function() {
		alert(this.constructor + "'s draw function is not initialized!");
	};

	GenericMusicalStaffInterface.Drawables.IDrawable.prototype.update = function() {
		alert(this.constructor + "'s update function is not initialized!");
	};

	GenericMusicalStaffInterface.Drawables.RhythmicDrawable = function () {};

	GenericMusicalStaffInterface.Drawables.RhythmicDrawable.prototype = new GenericMusicalStaffInterface.Drawables.IDrawable();

	GenericMusicalStaffInterface.Drawables.RhythmicDrawable.prototype.update = function(elapsedTime) {
		/* MRM taken out, since updating is no longer needed
		// pixels / second
		var newX = GenericMusicalStaffInterface.Var.BPM * (elapsedTime) / 1000;

		this.x = this.x - newX;

		if(this.x <= 0)
		{
			this.x = this.x + 900;
		}

		this.a = (this.x <= GenericMusicalStaffInterface.Var.StartFadeOut ? Math.max((GenericMusicalStaffInterface.Var.EndFadeOut - this.x) / (GenericMusicalStaffInterface.Var.EndFadeOut - GenericMusicalStaffInterface.Var.StartFadeOut), 0) :
			(this.x >= GenericMusicalStaffInterface.Var.EndFadeIn ? Math.max((GenericMusicalStaffInterface.Var.StartFadeIn - this.x) / (GenericMusicalStaffInterface.Var.StartFadeIn - GenericMusicalStaffInterface.Var.EndFadeIn), 0) : 1));
		*/
	};

	GenericMusicalStaffInterface.Drawables.MeasureBar = function (newX) {
		this.x = newX;
	} 

	GenericMusicalStaffInterface.Drawables.MeasureBar.prototype = new GenericMusicalStaffInterface.Drawables.RhythmicDrawable();
	GenericMusicalStaffInterface.Drawables.MeasureBar.prototype.extraHeight = false;


	GenericMusicalStaffInterface.Drawables.MeasureBar.prototype.draw = function(context) {
		context.save();
		context.globalAlpha = this.a;
		context.fillStyle = this.color;
		var top = (this.extraHeight ? GenericMusicalStaffInterface.Var.TopBar - GenericMusicalStaffInterface.Var.ExtraTopMeasureBar : GenericMusicalStaffInterface.Var.TopBar);
		var height = (this.extraHeight ? 4 * GenericMusicalStaffInterface.Var.LineSpacing + 2 * GenericMusicalStaffInterface.Var.ExtraTopMeasureBar : 4 * GenericMusicalStaffInterface.Var.LineSpacing);
		context.fillRect(this.x -(GenericMusicalStaffInterface.Var.LineWidth) / 2, top, GenericMusicalStaffInterface.Var.LineWidth, height);
		context.restore();
	}

	GenericMusicalStaffInterface.Drawables.LedgerLine = function (newX, newY) {
		this.x = newX;
		this.y = newY;
	}

	GenericMusicalStaffInterface.Drawables.LedgerLine.prototype = new GenericMusicalStaffInterface.Drawables.RhythmicDrawable();

	GenericMusicalStaffInterface.Drawables.LedgerLine.prototype.draw = function(context) {
		context.save();
		context.globalAlpha = this.a;
		context.fillStyle = this.color;
		context.fillRect(this.x - GenericMusicalStaffInterface.Var.NoteWidth / 2 - GenericMusicalStaffInterface.Var.ExtraLedgerLineLength, this.y - GenericMusicalStaffInterface.Var.LineWidth / 2, GenericMusicalStaffInterface.Var.NoteWidth + 2 * GenericMusicalStaffInterface.Var.ExtraLedgerLineLength, GenericMusicalStaffInterface.Var.LineWidth);
		context.restore();
	}

	GenericMusicalStaffInterface.Drawables.StaffBar = function (newY) {
		this.y = newY;
	};

	GenericMusicalStaffInterface.Drawables.StaffBar.prototype = new GenericMusicalStaffInterface.Drawables.IDrawable();

	GenericMusicalStaffInterface.Drawables.StaffBar.prototype.draw = function(context, min, max) {
		context.fillStyle = this.color;
		var start = Math.max(GenericMusicalStaffInterface.Var.EndFadeOut, min);
		var end = Math.min(GenericMusicalStaffInterface.Var.StartFadeIn, max);
		context.fillRect(start, this.y - GenericMusicalStaffInterface.Var.LineWidth / 2, end - start, GenericMusicalStaffInterface.Var.LineWidth);
	}

	GenericMusicalStaffInterface.Var.Notes = ['A','B','C','D','E','F','G'];

	GenericMusicalStaffInterface.Drawables.Note = function (newType,x,y) {
		this.type = newType.toUpperCase();
		
		this.x = x;
		this.y = y;
		
		this.LedgerLines = GenericMusicalStaffInterface.createLedgerLines(this.x, this.type);
		
		//if(this.type.length == 3)
		//{
			//createAccidental(note, octave, x);
		//}
	};

	GenericMusicalStaffInterface.createLedgerLines = function (x, str) {
		//Note: 2 notes that need ledger lines will both double up on shared
		//ledger lines. Could be optimized better

		var ledgers = [];
		
		//Can turn this following bit into function, notesBelowTopLine
		var note, octave;
		note = str.charAt(0);
		octave = parseInt(str.charAt(str.length - 1));
		
		refNote = GenericMusicalStaffInterface.Var.TopNote.charAt(0);
		refOct = parseInt(GenericMusicalStaffInterface.Var.TopNote.charAt(1));
		
		var noteCount = 0;
		
		while(refOct > octave)
		{
			octave++;
			noteCount += 7;
		}
		
		while(refOct < octave)
		{
			octave--;
			noteCount -= 7;
		}
		
		var ind = GenericMusicalStaffInterface.Var.Notes.indexOf(note);
		var refInd = GenericMusicalStaffInterface.Var.Notes.indexOf(refNote);
		
		noteCount -= (ind - refInd);
		
		if(noteCount > 0)
		{
			var noteIndex = 10; //Any number above this is ledger line qual.
			
			while(noteIndex <= noteCount)
			{
				var y = GenericMusicalStaffInterface.Var.TopBar + noteIndex / 2 * GenericMusicalStaffInterface.Var.LineSpacing;
				ledgers.push(new GenericMusicalStaffInterface.Drawables.LedgerLine(x, y));
				noteIndex += 2;
			}
		}
		else
		{
			var noteIndex = -2; //Any number above this is ledger line qual.
			while(noteIndex >= noteCount)
			{
				var y = GenericMusicalStaffInterface.Var.TopBar + noteIndex / 2 * GenericMusicalStaffInterface.Var.LineSpacing;
				ledgers.push(new GenericMusicalStaffInterface.Drawables.LedgerLine(x, y));
				noteIndex -= 2;
			}
		}
		
		return ledgers;
	};

	GenericMusicalStaffInterface.getRelativeNote = function (str) {
	//will not work with notes like C10 or B-1
		var note, octave;
		note = str.charAt(0);
		octave = parseInt(str.charAt(str.length - 1));
		
		refNote = GenericMusicalStaffInterface.Var.TopNote.charAt(0);
		refOct = parseInt(GenericMusicalStaffInterface.Var.TopNote.charAt(1));
		
		var noteCount = 0;
		
		while(refOct > octave)
		{
			octave++;
			noteCount += 7;
		}
		
		while(refOct < octave)
		{
			octave--;
			noteCount -= 7;
		}
		
		var ind = GenericMusicalStaffInterface.Var.Notes.indexOf(note);
		var refInd = GenericMusicalStaffInterface.Var.Notes.indexOf(refNote);
		
		noteCount -= (ind - refInd);
		
		return GenericMusicalStaffInterface.Var.TopBar + noteCount / 2 * GenericMusicalStaffInterface.Var.LineSpacing;
	};

	GenericMusicalStaffInterface.Drawables.Note.prototype = new GenericMusicalStaffInterface.Drawables.RhythmicDrawable();

	GenericMusicalStaffInterface.Drawables.Note.prototype.measure = 1;

	GenericMusicalStaffInterface.Drawables.Note.prototype.beat = 1;
	
	GenericMusicalStaffInterface.Drawables.Note.prototype.update = function(elapsedTime) {
		// copied from RhythmicDrawable
		var newX = GenericMusicalStaffInterface.Var.BPM * (elapsedTime) / 1000;

		this.x = this.x - newX;

		if(this.x <= 0)
		{
			this.x = this.x + 900;
		}

		this.a = (this.x <= GenericMusicalStaffInterface.Var.StartFadeOut ? Math.max((GenericMusicalStaffInterface.Var.EndFadeOut - this.x) / (GenericMusicalStaffInterface.Var.EndFadeOut - GenericMusicalStaffInterface.Var.StartFadeOut), 0) :
			(this.x >= GenericMusicalStaffInterface.Var.EndFadeIn ? Math.max((GenericMusicalStaffInterface.Var.StartFadeIn - this.x) / (GenericMusicalStaffInterface.Var.StartFadeIn - GenericMusicalStaffInterface.Var.EndFadeIn), 0) : 1));

		for(var i = 0; i < this.LedgerLines.length; i++)
		{
			this.LedgerLines[i].update(elapsedTime);
		}
	};

	GenericMusicalStaffInterface.Drawables.Note.prototype.draw = function(context) {
		context.save(); //MRM switched these around, hopefully didn't break
		context.beginPath();//MRM
		context.translate(this.x, this.y);
		context.rotate(GenericMusicalStaffInterface.Var.NoteRotation);
		context.scale(1, GenericMusicalStaffInterface.Var.NoteHeightToWidth);
		context.globalAlpha = this.a;
		context.arc(0, 0, GenericMusicalStaffInterface.Var.NoteWidth, 0 , 2 * Math.PI, false);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
		context.restore();
		for(var i = 0; i < this.LedgerLines.length; i++)
			this.LedgerLines[i].draw(context);
	};

	GenericMusicalStaffInterface.Drawables.Note.prototype.LedgerLines = []; 
}

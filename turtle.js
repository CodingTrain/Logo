const commands = {
  "fd": function (amt) {
    turtle.forward(amt);
  },
  "bd": function (amt) {
    turtle.forward(-amt);
  },
  "rt": function (angle) {
    turtle.right(angle);
  },
  "lt": function (angle) {
    turtle.right(-angle);
  },
  "pu": function () {
    turtle.pen = false;
  },
  "pd": function () {
    turtle.pen = true;
  },
  "repeat": function (val, cmd) {
	  for (var j = 0; j < val; j++)
	  {
	  	  	for (var i = 0; i < cmd.length; i++)
			{
				commands[cmd[i].replace("[", "").replace("]", "")](cmd[++i].replace("[", "").replace("]", ""));
			}
	  }
  },
  "train": function () {
  }
}

class Turtle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dir = angle;
  }

  reset() {
    console.log(this.x, this.y, this.dir);
    translate(this.x, this.y);
    rotate(this.dir);
    this.pen = true;
  }

  forward(amt) {
    amt = float(amt);
    if (this.pen) {
      stroke(255);
      strokeWeight(2);
      line(0, 0, amt, 0);
    }
    translate(amt, 0);
  }

  right(angle) {
    rotate(angle);
  }


}
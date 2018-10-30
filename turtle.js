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
  "clr": function (color) {
    turtle.color = color;
  }
}

class Turtle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dir = angle;
    this.color = 'white';
  }

  reset() {
    translate(this.x, this.y);
    rotate(this.dir);
    this.pen = true;
  }

  forward(amt) {
    amt = parseInt(amt);
    if (this.pen) {
      stroke(this.color);
      strokeWeight(2);
      line(0, 0, amt, 0);
    }
    translate(amt, 0);
  }

  right(angle) {
    rotate(angle);
  }

}
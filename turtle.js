const commands = {
  "fd": (amt) => {
    turtle.forward(amt);
  },
  "bd": (amt) => {
    turtle.forward(-amt);
  },
  "rt": (angle) => {
    turtle.right(angle);
  },
  "lt": (angle) => {
    turtle.right(-angle);
  },
  "pu": () => {
    turtle.pen = false;
  },
  "pd": () => {
    turtle.pen = true;
  },
  "clr": (color) => {
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
    this.color = 'white';
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
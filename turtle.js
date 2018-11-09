const commandLookUp = {
  fd: function(amt) {
    turtle["forward"](amt);
  },
  bd: function(amt) {
    turtle["forward"](-amt);
  },
  rt: function(angle) {
    turtle["right"](angle);
  },
  lt: function(angle) {
    turtle["right"](-angle);
  },
  pu: function() {
    turtle.pen = false;
  },
  pd: function() {
    turtle.pen = true;
  },
  setxy: function(x, y) {
    turtle.x = x;
    turtle.y = y;
  },
  setx: function(x) {
    turtle.x = x;
  },
  sety: function(y) {
    turtle.y = y;
  },
  color: function(hex) {
    // sanity sake let you use hex without the need for #
    if (hex[0] != "#") {
      hex = "#" + hex;
    }

    turtle.stroke = color(hex);
  }
};

class Turtle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dir = angle;
    this.stroke = 255;
  }

  reset() {
    console.log(this.x, this.y, this.dir);
    translate(this.x, this.y);
    rotate(this.dir);
    this.pen = true;
  }

  forward(amt) {
    amt = parseInt(amt);
    if (this.pen) {
      stroke(this.stroke);
      strokeWeight(1);
      line(0, 0, amt, 0);
    }
    translate(amt, 0);
  }

  right(angle) {
    rotate(angle);
  }
}

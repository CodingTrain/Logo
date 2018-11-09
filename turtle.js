const commandLookUp = {
  // Movement functions such as: forward, backward, right, left
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

  // Start and stop the "pen" from drawing
  pu: function() {
    turtle.pen = false;
  },
  pd: function() {
    turtle.pen = true;
  },

  // Set the turtles postion on the canvas
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
  home: function() {
    turtle["home"]();
  },

  // This is the Logo spec for color
  color: function(hex) {
    // sanity sake let you use hex without the need for #
    if (hex[0] != "#") {
      hex = "#" + hex;
    }

    turtle.strokeColor = color(hex);
  },

  // These are also apart of the Logo spec to let you swap between them
  degrees: function() {
    angleMode(DEGREES);
  },
  radians: function() {
    angleMode(RADIANS);
  }
};

class Turtle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.homeX = x;
    this.homeY = y;

    this.dir = angle;
    this.strokeColor = 255;
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
      stroke(this.strokeColor);
      strokeWeight(1);
      line(0, 0, amt, 0);
    }
    translate(amt, 0);
  }

  right(angle) {
    rotate(angle);
  }

  home() {
    this.x = this.homeX;
    this.y = this.homey;
  }
}

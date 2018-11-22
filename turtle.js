class Turtle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.homeX = x;
    this.homeY = y;
    this.prevX = x;
    this.prevY = y;

    this.dir = angle;
    this.strokeColor = 255;
    this.strokeWeight = 1;
  }

  reset() {
    this.pen = true;
  }

  forward(amt) {
    // Move the turtle
    this.x += cos(this.dir) * amt;
    this.y += sin(this.dir) * amt;

    // If the pen is down we should draw a line from the previous position to the new position
    if (this.pen) {
      stroke(this.strokeColor);
      strokeWeight(this.strokeWeight);
      line(this.prevX, this.prevY, this.x, this.y);
    }

    // The current position will become the next previous position
    this.prevX = this.x;
    this.prevY = this.y;
  }

  right(angle) {
    this.dir += angle;
  }

  home() {
    this.x = this.homeX;
    this.y = this.homeY;
  }
}

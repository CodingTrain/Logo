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
    this.x += Math.cos(this.dir * Math.PI / 180) * amt;
    this.y += Math.sin(this.dir * Math.PI / 180) * amt;
  }

  right(angle) {
    rotate(angle);
    this.dir += angle;
  }

  home() {
    this.x = this.homeX;
    this.y = this.homey;
  }
}

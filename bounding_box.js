class BoundingBox {

  constructor() {
    this.reset();
  }

  reset() {
    // By default it's positioned with top-left corner at [0,0] with a width and height of 1.
    // The x and y values are always the center
    this.left = this.top = 0;
    this.right = this.bottom = 1;
    this.width = this.height = 1;
    this.x = this.y = .5;
  }

  move(x, y) {
    this.left += x;
    this.right += x;
    this.x += x;
    this.top += y;
    this.bottom += y;
    this.y += y;
  }

  includePoint(x, y) {
    this.left = Math.min(this.left, x);
    this.right = Math.max(this.right, x);
    this.top = Math.min(this.top, y);
    this.bottom = Math.max(this.bottom, y);
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    this.x = this.left + this.width * .5;
    this.y = this.top + this.height * .5;
  }

}
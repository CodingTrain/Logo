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
  "repeat": function (arg, repeat) {
    let count = 0;
    repeat = repeat.substring(1, repeat.length-(repeat.length - repeat.indexOf("]")));
    for (let i = 0; i < arg; i++){
      let tokens = repeat.split(" ");
      let index = 0;
      let count = 0;
      let repeats = lookForReapeat(tokens);
      while (index < tokens.length) {
        let token = tokens[index];
        if (commands[token]) {
          if (token.charAt(0) === 'p') {
            commands[token]();
          } else if (token.charAt(0) === 'r'){
              commands[token](tokens[++index], repeats[count]);
              count++;
            } else {
            commands[token](tokens[++index]);
          }
        }
        index++;
      }
    }
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
    amt = parseInt(amt);
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

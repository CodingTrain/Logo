function parseCode(str, buffer = []) {
  let funcName = "",
    other = [];

  while (str.length) {
    [
      funcName,
      ...other
    ] = str.split(" ");
    str = (prepares[funcName] || prepares["default"])(other, buffer, funcName).trim();
  }
}

function indexOfClose(str, open, close) {
  let start = 1,
    char = "",
    limit = str.length,
    index = 0;

  while (start && index < limit) {
    index++;
    char = str.charAt(index);
    start = char == open ? start + 1 : start;
    start = char == close ? start - 1 : start;
  }
  return index;
}


const prepares = {
  repeat: function (rest, buffer) {
    let [
      num,
      ...other
    ] = rest,
      str = other.join(" "),
      indexEnd = indexOfClose(str.trim(), "[", "]"),
      strRepeat = str.slice(1, indexEnd),
      restEnd = str.slice(indexEnd + 1, str.length);

    num = parseInt(num);

    for (let i = 0; i < num; i++) {
      parseCode(strRepeat.trim(), buffer);
    }

    return restEnd;
  },
  default: function (rest, buffer, funcName) {
    buffer.push(funcName);
    return rest.join(" ");
  },
};


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

const commands = {
  "fd": function (refCode) {
    const amt = nextNumber(refCode);
    if (!amt) return;
    turtle.forward(amt);
  },
  "bd": function (refCode) {
    const amt = nextNumber(refCode);
    if (!amt) return;
    turtle.forward(-amt);
  },
  "rt": function (refCode) {
    const angle = nextNumber(refCode);
    if (!angle) return;
    turtle.right(angle);
  },
  "lt": function (refCode) {
    const angle = nextNumber(refCode);
    if (!angle) return;
    turtle.right(-angle);
  },
  "pu": function () {
    turtle.pen = false;
  },
  "pd": function () {
    turtle.pen = true;
  },
  "repeat": function (refCode) {
    let repeat = nextNumber(refCode);
    if (!repeat) return;
    const openBracket = nextToken(refCode, "\\[");
    if (!openBracket) return;
    let localCode = refCode.code;
    const closeBracket = nextToken(refCode, "\\]");
    if (!closeBracket) return;
    localCode = localCode.substr(0, localCode.indexOf(']'));
    for( ; repeat > 0; repeat--)
      turtle.eat(localCode);
  }
}

function nextCmd(refCode) {
  return nextToken(refCode, "[a-z]+");
}

function nextNumber(refCode) {
  return nextToken(refCode, "[0-9]+");
}

function nextToken(refCode, reg) {
  const found = refCode.code.match(reg);
  if (found) {
    eatToken(refCode, found[0]);
    return found[0];
  }
  return null;
}

function eatToken(refCode, token) {
  const tokenPos = refCode.code.indexOf(token);
  refCode.code = refCode.code.substr(tokenPos + token.length);
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

  eat(code) {
    let refCode = {code:code};
    while(refCode.code.length) {
      const cmd = nextCmd(refCode);
      if (!cmd) break;
      if (commands[cmd]) {
        commands[cmd](refCode);
      }
    }
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
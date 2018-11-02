// All the commands receives the tokens and consumes them as needed.
const commands = {
  "fd": function (tokens) {
    const amt = parseInt(tokens.shift());
    turtle.forward(amt);
  },
  "bd": function (tokens) {
    const amt = parseInt(tokens.shift());
    turtle.forward(-amt);
  },
  "rt": function (tokens) {
    const angle = parseInt(tokens.shift());
    turtle.right(angle);
  },
  "lt": function (tokens) {
    const angle = parseInt(tokens.shift());
    turtle.right(-angle);
  },
  "pu": function (tokens) {
    turtle.pen = false;
  },
  "pd": function (tokens) {
    turtle.pen = true;
  },
  "repeat" : function (tokens) {
    // Crazy parsing and error checking
    const times = parseInt(tokens.shift());
    const block = [];
    
    let nx = tokens.shift();
    if (nx != '[') return; // Sintax error :P
    
    nx = tokens.shift();
    while(nx != ']'){
      block.push(nx);
      nx = tokens.shift();
    }
    
    if(nx === ']')
      turtle.repeat(times, block); // Finally executes the command!
  }
}

// Forget about index and look at token as a queue
function runcommands(tokens){
  while (tokens.length > 0) {
    let token = tokens.shift();
    if (commands[token]){
      commands[token](tokens);
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
    //console.log(this.x, this.y, this.dir);
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

  // Just copy the block and run the commands again!
  repeat(times, block){
    for(let i = 0; i < times; i++){
      let ts = block.slice();
      runcommands(ts);
    }
  }


  


}
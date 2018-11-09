class Parser {
  constructor(text) {
    this.text = text;
    this.index = 0;
  }

  remainingTokens() {
    return this.index < this.text.length;
  }

  getRepeat() {
    while (this.text.charAt(this.index++) !== '[' && this.remainingTokens()) {}
    let start = this.index;

    let bracketCount = 1;
    while (bracketCount > 0 && this.remainingTokens()) {
      let char = this.text.charAt(this.index++);
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
      }
    }
    let end = this.index;
    return this.text.substring(start, end - 1);
  }

  nextToken() {
    let token = '';
    let char = this.text.charAt(this.index);

    // If it's a space ignore
    if (char === ' ' || char == '\n') {
      this.index++;
      return this.nextToken();
    }

    // If it's a bracker send that back
    if (char === '[' || char === ']') {
      this.index++;
      return char;
    }

    // Otherwise accumulate until a space
    while (char !== ' ' && this.remainingTokens() && char !== '\n') {
      token += char;
      char = this.text.charAt(++this.index);
    }
    return token;
  }

  parseExpression(last) {
    let token = new Expression('$', this.nextToken());
    let temp = this.index;
    let next = this.nextToken();
    let e;
    let right;
    if(next == '/' || next == '*') {
      right = this.parseExpression();
      e = new Expression(next, token, right);
    } else if(next == '+' || next == '-') {
      right = this.parseExpression();
      e = new Expression(next, token, right); 
    } else {
      this.index = temp;
      return token;
    }
    console.log(right);
    if(right.lvl() > e.lvl()) {
      let new_left = new Expression(next, token, right.left);
      e = new Expression(right.type, new_left, right.right);
    }
    return e;
  }

  parse() {
    let commands = [];
    let movement = /^([fb]d|[lr]t)$/;
    let pen = /^p/;
    let repeat = /^repeat$/;
    while (this.remainingTokens()) {
      let token = this.nextToken();
      if (movement.test(token)) {
        let cmd = new Command(token, this.parseExpression());
        commands.push(cmd);
      } else if (pen.test(token)) {
        let cmd = new Command(token);
        commands.push(cmd);
      } else if (repeat.test(token)) {
        let cmd = new Command(token, this.parseExpression());
        let toRepeat = this.getRepeat();
        let parser = new Parser(toRepeat);
        cmd.commands = parser.parse();
        commands.push(cmd);
      }
    }
    return commands;
  }


}

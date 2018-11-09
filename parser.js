class Parser {
  constructor(text) {
    this.text = text;
    this.index = 0;
  }

  remainingTokens() {
    return this.index < this.text.length;
  }

  getRepeat() {
    while (this.text.charAt(this.index++) !== "[" && this.remainingTokens()) {}
    let start = this.index;

    let bracketCount = 1;
    while (bracketCount > 0 && this.remainingTokens()) {
      let char = this.text.charAt(this.index++);
      if (char === "[") {
        bracketCount++;
      } else if (char === "]") {
        bracketCount--;
      }
    }
    let end = this.index;
    return this.text.substring(start, end - 1);
  }

  nextToken() {
    let token = "";
    let char = this.text.charAt(this.index);

    // If it's a space ignore
    if (char === " ") {
      this.index++;
      return this.nextToken();
    }

    // If it's a bracker send that back
    if (char === "[" || char === "]") {
      this.index++;
      return char;
    }

    // Otherwise accumulate until a space
    while (char !== " " && this.remainingTokens()) {
      token += char;
      char = this.text.charAt(++this.index);
    }
    return token;
  }

  parse() {
    let commands = [];
    let movement = /^([fb]d|[lr]t)$/;
    let noArgsCalls = /^p|home|degrees|radians/;
    let repeat = /^repeat$/;
    let setxy = /^setxy$/;
    let color = /^color$/;
    let setxySingle = /^set[xy]$/;

    while (this.remainingTokens()) {
      let token = this.nextToken();
      let cmd = undefined;
      if (movement.test(token)) {
        cmd = new Command(token, parseFloat(this.nextToken()));
      } else if (noArgsCalls.test(token)) {
        cmd = new Command(token);
      } else if (repeat.test(token)) {
        cmd = new Command(token, parseInt(this.nextToken()));
        let toRepeat = this.getRepeat();
        let parser = new Parser(toRepeat);
        cmd.commands = parser.parse();
      } else if (setxy.test(token)) {
        cmd = new Command(token);
        let argX = this.nextToken();
        let argY = this.nextToken();
        cmd.arg = [parseFloat(argX), parseFloat(argY)];
      } else if (color.test(token)) {
        cmd = new Command(token, this.nextToken());
      } else if (setxySingle.test(token)) {
        cmd = new Command(token, parseFloat(this.nextToken()));
      }

      if (cmd) {
        commands.push(cmd);
      }
    }
    return commands;
  }
}

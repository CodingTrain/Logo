
class Parser {

  /**
   * Creates an instance of Parser.
   * @param {String} text The text to parse
   * @param {Function} afterCmdCallback Function to execute after the commands are executed
   * @memberof Parser
   */
  constructor(text, afterCmdCallback) {
    if (!text) text = '';

    this.text = text.trim();
    this.index = 0;
    this.afterCmdCallback = afterCmdCallback
  }

  /**
   * Private method
   *
   * @returns Boolean If the index has surpased the length of the text or not.
   * @memberof Parser
   */
  remainingTokens() {
    return this.index < this.text.length;
  }

  /**
   * Private method
   *
   * @returns String The next token after the actual index.
   * @memberof Parser
   */
  nextToken() {
    let regWhitespace = /\s/;

    while (regWhitespace.test(this.text.charAt(this.index)) && this.remainingTokens()) this.index++;

    let firstChar = this.text.charAt(this.index);

    let token = '';
    let isTokenList = false;
    let depth = 0;

    if (firstChar === '['){

      this.index++;
      depth++;
      isTokenList = true;
    }

    let actualChar = this.text.charAt(this.index);

    while(((regWhitespace.test(actualChar) && isTokenList) || !regWhitespace.test(actualChar)) && this.remainingTokens()) {
      this.index++;

      if (isTokenList) {
        if (actualChar === '[') depth++;
        else if (actualChar === ']') depth--;

        if (actualChar === ']' && depth === 0) return token;
      }

      token += actualChar;
      actualChar = this.text.charAt(this.index);
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


  /**
   * Public method
   *
   * @returns [CommandExecutor] Parsed text converted into CommandExecutors
   *    ready to be executed.
   * @memberof Parser
   */
  parse() {
    let cmdsExecutors = [];
    while (this.remainingTokens()) {
      let token = this.nextToken();
      
      let cmd = undefined;

      // testCommand to refactor
      function testCommand(value, data) { return value.test(data) }

      if (testCommand(movement, token)) {
        cmd = new Command(token, this.parseExpression());
      } else if (testCommand(noArgsCalls, token)) {
        cmd = new Command(token);
      } else if (testCommand(repeat, token)) {
        cmd = new Command(token, this.parseExpression());
        let toRepeat = this.getRepeat();
        let parser = new Parser(toRepeat);
        cmd.commands = parser.parse();
      } else if (testCommand(setxy,token)) {
        cmd = new Command(token);
        let argX = this.nextToken();
        let argY = this.nextToken();
        cmd.arg = [parseFloat(argX), parseFloat(argY)];
      } else if (testCommand(color, token)) {
        cmd = new Command(token, this.nextToken());
      } else if (testCommand(setxySingle,token)) {
        cmd = new Command(token, parseFloat(this.nextToken()));
      }

      const actualToken = this.nextToken();
      let cmd = commandLookUp.get(actualToken);

      if (cmd) {
        let args = [];
        for (let i = 0; i < cmd.argsTemplate.length; i++) {
          args.push(this.nextToken());
        }

        cmdsExecutors.push(new CommandExecutor(cmd, args, this.afterCmdCallback));
      }
    }

    return cmdsExecutors;
  }
}


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
      const actualToken = this.nextToken();
      let cmd = commandLookUp.get(actualToken);

      if (cmd) {
        let args = [];
        for (let i = 0; i < cmd.argsTemplate.length; i++) {
	  if(cmd.argsTemplate[i].type == COMMAND_TYPES.FLOAT || cmd.argsTemplate[i].type == COMMAND_TYPES.INT) {
            args.push(this.parseExpression());
          } else {
            args.push(this.nextToken());
          }
        }
	console.log(cmdsExecutors);

        cmdsExecutors.push(new CommandExecutor(cmd, args, this.afterCmdCallback));
      }
    }

    return cmdsExecutors;
  }
}

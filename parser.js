
class Parser {

  /**
   * Creates an instance of Parser.
   * @param {String} text The text to parse
   * @memberof Parser
   */
  constructor(text) {
    if (!text) text = '';

    this.text = text.trim();
    this.index = 0;
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
    while (this.text.charAt(this.index) === ' ' && this.remainingTokens()) this.index++;

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

    while(((actualChar === ' ' && isTokenList) || actualChar !== ' ') && this.remainingTokens()) {
      if (isTokenList) {
        if (actualChar === '[') depth++;
        else if (actualChar === ']') depth--;

        if (actualChar === ']' && depth === 0) {
          this.index++;
          return token;
        }
      }

      token += actualChar;
      actualChar = this.text.charAt(++this.index);
    }

    return token;
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
          args.push(this.nextToken());
        }

        cmdsExecutors.push(new CommandExecutor(cmd, args));
      }
    }

    return cmdsExecutors;
  }
}


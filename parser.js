
class Parser {
  constructor(text) {
    if (!text || typeof text !== 'string')
      throw new Error('Parser needs one argument of the type String');

    this.text = text.trim();
    this.index = 0;
  }

  remainingTokens() {
    return this.index < this.text.length;
  }
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


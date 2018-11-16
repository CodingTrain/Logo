/**
 * This are the types a Command Argument can be:
 * - STR: String, as its parsed it will returned.
 * - INT: Integer, the parsed value will be casted into base10 Integer.
 * - FLOAT: Float, the parsed value will be casted into a float js object.
 * - COMMANDS: List of commands, the parsed value will be parse into Command
 *    Executors that will be executed.
 * - PARAMETERS: Parameters, it almost doesnt make sense but is here to
 *    demonstrate the power of this way of parsing the content.
 */
const ARGUMENT_TYPES = {
  STR: "STR",
  INT: "INT",
  FLOAT: "FLOAT",
  COMMANDS: "COMMANDS",
  EXPRESSION: "EXPRESSION",
  PARAMETERS: "PARAMETERS" // Example
};

/**
 * Argument a command can accept. The most important of this class is the
 * type property.
 *
 * @class CommandArg
 */
class CommandArg {

  /**
   * Creates an instance of CommandArg.
   * @param {String} name Name of the argument
   * @param {ARGUMENT_TYPES} type Type of the argument. Its important because
   *    this will define how the token is parsed.
   * @param {*} validator Function used to check if the argument is valid
   * @memberof CommandArg
   */
  constructor(name, type, validator = undefined) {
    this.name = name;
    this.type = type;
    if (validator === undefined) {
      switch (type) {
        case ARGUMENT_TYPES.INT:
          this.validator = (str) => {
            return /^\d+$/.test(str);
          }
          break;
        case ARGUMENT_TYPES.FLOAT:
          this.validator = (str) => {
            return /^[-+]?[0-9]*\.?[0-9]*$/.test(str);
          }
          break;
        case ARGUMENT_TYPES.EXPRESSION:
          this.validator = (str) => {
            let res = /^[-+]?([0-9]+\.?[0-9]?|[0-9]*\.?[0-9]+)(\s[+-/*]{1}\s[-+]?([0-9]+\.?[0-9]?|[0-9]*\.?[0-9]+))*$/.test(str);
            return res;
          }
          break;
          case ARGUMENT_TYPES.COMMANDS:
            this.validator = (str,offset)=>{
              let p = new Parser(str,null,offset);
              
              p.parse()
              return true;
            }
          break;
      }
    } else
      this.validator = validator;
  }
}

/**
 * Command that can be executed.
 *
 * @class Command
 */
class Command {

  /**
   * Creates an instance of Command.
   * @param {String} name Name of the command, againts this name the tokens will be
   *    matched.
   * @param {[CommandArg]} args An array of CommandArg that this command needs in
   *    order to work.
   * @param {*} func The JS function that will be executed when this command needs
   *    to be executed.
   * @memberof Command
   */
  constructor(name, args, func) {
    this.name = name;
    this.argsTemplate = args;
    this.func = func;
  }
}

/**
 * The command executor purpose is to hold the command to execute and the parsed
 * arguments that has been read from the code.
 */
class CommandExecutor {

  /**
   * Creates an instance of CommandExecutor.
   * @param {Command} command The command you will want to execute.
   * @param {[String]} values An array of string tokens, this array needs
   *    to be the same length of the arguments the commands can accept.
   *    These values will be casted to the argument type it corresponds to.
   * @param {Function} callback Function to execute after the command is executed.
   * @memberof CommandExecutor
   */
  constructor(command, values, callback) {
    this.callback = callback;
    this.command = command;
    this.values = [];

    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      let argTemplate = this.command.argsTemplate[i].type;

      switch (argTemplate) {
        case ARGUMENT_TYPES.STR:
          this.values.push(value);
          break;
        case ARGUMENT_TYPES.INT:
          this.values.push(parseInt(value));
          break;
        case ARGUMENT_TYPES.FLOAT:
          this.values.push(parseFloat(value));
          break;
        case ARGUMENT_TYPES.COMMANDS:
          this.values.push(
            new Parser(value, this.callback).parse()
          );
          break;
        case ARGUMENT_TYPES.EXPRESSION:
          this.values.push(this.parseExpression(value).eval());
          break;
        case ARGUMENT_TYPES.PARAMETERS: // Example
          this.values.push(value.split(" "));
          break;
        default:
          console.log("Unknown argType: ", argTemplate);
          break;
      }
    }
  }
  parseExpression(ExpressionString) {
    let p = new Parser(ExpressionString,null);
    let token = p.nextToken();
    let next = p.nextToken();
    let e;
    let right;
    if (next == '/' || next == '*' || next == '+' || next == '-') {
      right = this.parseExpression(p.getArgs());
      e = new Expression(next,new Expression('$',token), right);
    } else
      return new Expression('$', token);
    if (right.lvl() > e.lvl()) {
      let new_left = new Expression(next, new Expression('$',token), right.left);
      e = new Expression(right.type, new_left, right.right);
    }
    return e;
  }
  /**
   * Executes the command with the values given at the creation of the
   * instance.
   *
   * @memberof CommandExecutor
   */
  execute(repcount) {
    this.command.func.apply(this, this.values);
    if (this.callback) {
      this.callback();
    }
  }
}

/**
 * It stores all the commands available.
 *
 * @class CommandLookUp
 */
class CommandLookUp {

  /**
   * Creates an instance of CommandLookUp.
   * @memberokUp
   */
  constructor() {
    this.commands = [];
  }

  /**
   * Adding a new command to the list.
   *
   * @param {Command} command New command to add to the list.
   * @memberof CommandLookUp
   */
  add(command) {
    this.commands.push(command);
  }

  /**
   * Return a command that matches the name.
   *
   * @param {String} name The name of the command you want back.
   * @returns The command that matches the name, or null if it can't find it.
   * @memberof CommandLookUp
   */
  get(name) {
    let item = null;
    let index = 0;
    while (!item && index < this.commands.length) {
      if (this.commands[index].name === name) item = this.commands[index];

      index++;
    }

    return item;
  }
}


const COMMAND_TYPES = {
  STR: 'STR',
  INT: 'INT',
  COMMANDS: 'COMMANDS',
  PARAMETERS: 'PARAMETERS' // Example
}

class CommandArg {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class Command {
  constructor(name, args, func) {
    this.name = name;
    this.argsTemplate = args;
    this.func = func;
  }
}

class CommandExecutor {
  constructor(command, values) {
    this.command = command;
    this.values = [];

    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      let argTemplate = this.command.argsTemplate[i].type;

      switch (argTemplate) {
        case COMMAND_TYPES.STR:
          this.values.push(value);
          break;
        case COMMAND_TYPES.INT:
          this.values.push(parseInt(value));
          break;
        case COMMAND_TYPES.COMMANDS:
          this.values.push(
            new Parser(value).parse()
          );
          break;
        case COMMAND_TYPES.PARAMETERS: // Example
          this.values.push(
            value.split(' ')
          );
          break;
        default:
          break;
      }
    }
  }

  execute() {
    this.command.func.apply(this, this.values);
  }
}

class CommandLookUp {
  constructor() {
    this.commands = [];
  }
  add(command) {
    this.commands.push(command);
  }

  get(name) {
    let item = null;
    let index = 0;
    while(!item && index < this.commands.length) {
      if (this.commands[index].name === name)
        item = this.commands[index];

      index++;
    }

    return item;
  }
}

const commandLookUp = new CommandLookUp();

/**
 * To add a new command, just need the name, the arguments,
 * and then the function to execute.
 */

commandLookUp.add(new Command('fd', [
  new CommandArg('value', COMMAND_TYPES.INT)
], (value) => {
  turtle.forward(value);
}));

commandLookUp.add(new Command('bd', [
  new CommandArg('value', COMMAND_TYPES.INT)
], (value) => {
  turtle.forward(-value);
}));

commandLookUp.add(new Command('rt', [
  new CommandArg('value', COMMAND_TYPES.INT)
], (value) => {
  turtle.right(value);
}));

commandLookUp.add(new Command('lt', [
  new CommandArg('value', COMMAND_TYPES.INT)
], (value) => {
  turtle.right(-value);
}));

commandLookUp.add(new Command('pu', [], () => {
  turtle.pen = false;
}));

commandLookUp.add(new Command('pd', [], () => {
  turtle.pen = true;
}));

commandLookUp.add(new Command('setxy', [
  new CommandArg('x', COMMAND_TYPES.INT),
  new CommandArg('y', COMMAND_TYPES.INT)
], (x, y) => {
  turtle.x = x;
  turtle.y = y;
}));

commandLookUp.add(new Command('setx', [
  new CommandArg('x', COMMAND_TYPES.INT)
], (x) => {
  turtle.x = x;
}));

commandLookUp.add(new Command('sety', [
  new CommandArg('y', COMMAND_TYPES.INT)
], (y) => {
  turtle.y = y;
}));

commandLookUp.add(new Command('home', [], () => {
  turtle["home"]();
}));

commandLookUp.add(new Command('radians', [], () => {
  angleMode(DEGREES);
}));

commandLookUp.add(new Command('degrees', [], () => {
  angleMode(RADIANS);
}));

commandLookUp.add(new Command('repeat', [
  new CommandArg('lengthLoop', COMMAND_TYPES.INT),
  new CommandArg('commands', COMMAND_TYPES.COMMANDS)
], function (lengthLoop, commands) {
  for (let i = 0; i < lengthLoop; i++) {
    for (let cmd of commands) {
      cmd.execute();
    }
  }
}));

/**
 * Color, added as example. Given a value, it set the stroke.
 */
commandLookUp.add(new Command('color', [
  new CommandArg('color', COMMAND_TYPES.STR)
], (color) => {
  // sanity sake let you use hex without the need for #
  if (color[0] != "#") {
    color = "#" + color;
  }

  turtle.strokeColor = color;
}));

/**
 * Added as example of taking [...] as not only commands
 * but strings you can later process.
 * This command expects 3 args separated by spaces.
 */
commandLookUp.add(new Command('author', [
  new CommandArg('params', COMMAND_TYPES.PARAMETERS)
], (params) => {
  const [author, website, twitter] = params;
  console.log('This repository has been created by:');
  console.log(`${author} (@${twitter}) - ${website}`);
}));


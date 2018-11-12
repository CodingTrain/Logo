/**
 * This instance of the CommandLookUp class will be the global variable
 * that will store all the commands available.
 */
const commandLookUp = new CommandLookUp();

/**
 * To add a new command, just need the name, the arguments,
 * and then the function to execute.
 */
commandLookUp.add(
  new Command("fd", [new CommandArg("value", COMMAND_TYPES.FLOAT)], value => {
    turtle.forward(value);
  })
);

commandLookUp.add(
  new Command("bd", [new CommandArg("value", COMMAND_TYPES.FLOAT)], value => {
    turtle.forward(-value);
  })
);

commandLookUp.add(
  new Command("rt", [new CommandArg("value", COMMAND_TYPES.FLOAT)], value => {
    turtle.right(value);
  })
);

commandLookUp.add(
  new Command("lt", [new CommandArg("value", COMMAND_TYPES.FLOAT)], value => {
    turtle.right(-value);
  })
);

commandLookUp.add(
  new Command("pu", [], () => {
    turtle.pen = false;
  })
);

commandLookUp.add(
  new Command("pd", [], () => {
    turtle.pen = true;
  })
);

commandLookUp.add(
  new Command(
    "setxy",
    [
      new CommandArg("x", COMMAND_TYPES.FLOAT),
      new CommandArg("y", COMMAND_TYPES.FLOAT)
    ],
    (x, y) => {
      turtle.x = x;
      turtle.y = y;
    }
  )
);

commandLookUp.add(
  new Command("setx", [new CommandArg("x", COMMAND_TYPES.FLOAT)], x => {
    turtle.x = x;
  })
);

commandLookUp.add(
  new Command("sety", [new CommandArg("y", COMMAND_TYPES.FLOAT)], y => {
    turtle.y = y;
  })
);

commandLookUp.add(
  new Command("home", [], () => {
    turtle["home"]();
  })
);

commandLookUp.add(
  new Command("radians", [], () => {
    angleMode(DEGREES);
  })
);

commandLookUp.add(
  new Command("degrees", [], () => {
    angleMode(RADIANS);
  })
);

commandLookUp.add(
  new Command(
    "repeat",
    [
      new CommandArg("lengthLoop", COMMAND_TYPES.INT),
      new CommandArg("commands", COMMAND_TYPES.COMMANDS)
    ],
    function(lengthLoop, commands) {
      for (let i = 0; i < lengthLoop; i++) {
        for (let cmd of commands) {
          cmd.execute(i + 1);
        }
      }
    }
  )
);

/**
 * Color, added as example. Given a value, it set the stroke.
 */
commandLookUp.add(
  new Command("color", [new CommandArg("color", COMMAND_TYPES.STR)], color => {
    // sanity sake let you use hex without the need for #
    if (color[0] != "#") {
      color = "#" + color;
    }

    turtle.strokeColor = color;
  })
);

/*
 * Not apart of logo this allows us to use a RGB instead of HEX
 * Though not standard in logo this just gives us a slightly more fine grain color
 */
commandLookUp.add(
  new Command(
    "colorrgb",
    [new CommandArg("params", COMMAND_TYPES.PARAMETERS)],
    params => {
      let [r, g, b] = params;
      r = parseInt(r);
      g = parseInt(g);
      b = parseInt(b);

      if (r > 255) {
        r = 255;
      }
      if (r < 0) {
        r = 0;
      }

      if (g > 255) {
        g = 255;
      }
      if (g < 0) {
        g = 0;
      }

      if (b > 255) {
        b = 255;
      }
      if (r < 0) {
        b = 0;
      }

      turtle.strokeColor = color(r, g, b);
    }
  )
);

/**
 * Added as example of taking [...] as not only commands
 * but strings you can later process.
 * This command expects 3 args separated by spaces.
 */
commandLookUp.add(
  new Command(
    "author",
    [new CommandArg("params", COMMAND_TYPES.PARAMETERS)],
    params => {
      const [author, website, twitter] = params;
      console.log("This repository has been created by:");
      console.log(`${author} (@${twitter}) - ${website}`);
    }
  )
);

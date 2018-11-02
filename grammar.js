const ERASE = -1;
const UP = 0;
const DOWN = 1;

function parse(code) {
	if(!code) return [];
    const tokens = [];
    let token = "";
    code = code.trim() + " ";
    for(let i = 0; i < code.length; i++) {
        const ch = code.charAt(i);
        if(ch == ' ') {
            tokens.push(token);
            token = "";
        } else if (ch == '[') {
            let j = i+1;
            let brackets = 0;
            for(; j < code.length; j++) {
                const ch1 = code.charAt(j);
                if(ch1 == '[') {
                    brackets ++;
                } else if(ch1 == ']') {
                    if(brackets == 0) {
                        break;
                    }
                    else brackets--;
                }
                token += ch1;
            }
            tokens.push(token);
            token = "";
            i = j;
        } else  token += ch;
    }
    return tokens;
}

function execute(code_tokens) {
	for(let i = 0; i < code_tokens.length; i++) {
		const command = commands[code_tokens[i]];
		if(command) {
			const arg_len = command.length;
			const args = code_tokens.slice(i+1, i+1+arg_len);
			command(args);
			i += arg_len;
		}
	}
}

const fd = function (amt) {
	args = arguments[0];
	amt = parseInt(args[0]);
	turtle.move(amt);
}
const bk = function (amt) {
	args = arguments[0];
	amt = parseInt(args[0]);
	turtle.move(-amt);
}
const rt =  function (angle) {
	args = arguments[0];
	angle = parseInt(args[0]);
	turtle.turn(angle);
}
const lt = function (angle) {
	args = arguments[0];
	angle = parseInt(args[0]);
	turtle.turn(-angle);
}
const repeat = function(n, code) {
	args = arguments[0];
	n = parseInt(args[0]);
	code = args[1];
	code = parse(code);
	for(let i = 0; i < n; i++)
		execute(code);
}
const home = function() {
	turtle.reset();
}
const seth = function(angle) {
	args = arguments[0];
	angle = parseInt(args[0]);
	turtle.setDirection(angle);
}
const pu = function () {
	turtle.pen = UP;
}
const pd = function () {
	turtle.pen = DOWN;
}
const pe = function () {
	turtle.pen = ERASE;
}
const ht = function() {
	turtle.show = false;
}
const st = function() {
	turtle.show = true;
}
const setxy = function(x, y) {
	args = arguments[0];
	x = parseInt(args[0]);
	y = parseInt(args[1]);
	turtle.setPos(x, y);
}
const cs = function() {
	background(0);
}

/*
 Support for new commands can be added by writing the corresponding function
  above and then adding the callback to the commands object.
 */
const commands = {
	"fd": fd,
	"forward": fd,
	"bk": bk,
	"backward": bk,
	"rt": rt,
	"right": rt,
	"lt": lt,
	"left": lt,
	"pu": pu,
	"penup": pu,
	"pd": pd,
	"pendown": pd,
	"pe": pe,
	"penerase": pe,
	"ht": ht,
	"hideturtle": ht,
	"st": st,
	"showturtle": st,
	"repeat": repeat,
	"home": home,
	"seth": seth,
	"setxy": setxy,
	"cs": cs,
	"clearscreen": cs
}
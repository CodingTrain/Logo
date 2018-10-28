const commands = {
	'fd': fd,
	'bk': bk,
	'rt': rt,
	'lt': lt,
	'pu': pu,
    'pd': pd,
    'ht': ht,
    'st': st
};

class Turtle {
    constructor(x, 
                y, 
                angle = 0, 
                width = 10, 
                height = 10, 
                trailSize = 2, 
                trailColor = 'rgb(255, 255, 255)', 
                outerColor = 'rgb(125, 232, 130)', 
                innerColor = 'rgb(58, 132, 61)'
    ) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.drawing;
        this.visible;
        this.trailColor = trailColor;
        this.trailSize = trailSize;
        this.outerColor = outerColor;
        this.innerColor = innerColor;
    }

    reset() {
        translate(this.x, this.y);
        rotate(this.angle);
        this.drawing = true;
        this.visible = true;
    }

    turn(angle) {
        rotate(angle);
    }

    draw() {
        if (this.visible) {
            stroke(this.outerColor);
            fill(this.innerColor);
            rect(0, -this.height/2, this.width, this.height);
        }
    }

    move(distance) {
        if (this.drawing) {
            stroke(this.trailColor);
            strokeWeight(2);
            line(0, 0, distance, 0);
        }
        translate(distance, 0);
    }
}

function fd(stack) {
	const distance = parseInt(stack.shift());
	turtle.move(distance);
}

function bk(stack) {
	const distance = parseInt(stack.shift());
	turtle.move(-distance);
}

function rt(stack) {
	const angle = parseInt(stack.shift());
	turtle.turn(angle);
}

function lt(stack) {
	const angle = parseInt(stack.shift());
	turtle.turn(-angle);
}

function pu(_) {
	turtle.drawing = false;
}

function pd(_) {
	turtle.drawing = true;
}

function ht(_) {
    turtle.visible = false;
}

function st(_) {
    turtle.visible = true;
}

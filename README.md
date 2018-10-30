# Turtle Path Editor

_inspired by:_ [Daniel Shiffman](https://github.com/shiffman)

Turtles can't speak and don't understand human language, except there is one who also doesn't understand human language, but she understands something. The language she speaks is strange, but it can be mastered relatively fast and after that you will wield the turtle the way you always desired. See the rest of this documentation to learn her tongue.

## Turtle words

- `fd` followed by a `number`:<br>turtle will move forward `number` of times;
- `bd` followed by a `number`:<br>turtle will move backward `number` of times;
- `rt` followed by an `angle`:<br>turtle will turn right by the `angle`;
- `lt` followed by an `angle`:<br>turtle will turn left by the `angle`;
- `pu`:<br>turtle stops drawing and moves more secretive;
- `pd`:<br>turtle starts drawing the line after itself;
- `clr` followed by a `color`:<br>turtle changes line `color` to a new one;
- `repeat` followed by a `number` and \[array of commands\]:<br>turtle will repeat commands in the array `number` of times;
- `bckgr` followed by a `color`:<br>image will be filled with a new `color`;
- `save`:<br>save an image drawn by the turtle (be careful with this one).

[**Go, try them out!**](https://fabritsius.github.io/shiffmans-code-editor/)

## Possible improvements

- add support for nested `repeats`;
- allow `save` and `bckgr` to be used inside of a `repeat`;
- add cheatsheet to the web page.
# Turtle Path Editor

_inspired by:_ [Daniel Shiffman](https://github.com/shiffman)

Turtles can't speak and don't understand human language, except there is one who also doesn't understand human language, but she understands something. The language she speaks is strange, but it can be mastered relatively fast and after that you will wield the turtle the way you always desired. See the rest of this documentation to learn her tongue.

## Features

- uses a version of [Logo programming language](https://en.wikipedia.org/wiki/Logo_(programming_language));
- random [example](./examples) is shown each time webpage is reloaded;
- there is an option to save both your code and a generated image;
- you can Drag and Drop `.logocode` file right into the editor.

## Turtle words

- `fd` followed by a `number` (_ex.:_ `fd 50`, `fd 87`):<br>turtle will move forward `number` of times;
- `bd` means the same as `fd` but backwards (_ex.:_ `bd 10`);
- `rt` followed by an `angle` (_ex.:_ `rt 45`, `rt 120`):<br>turtle will turn right by the `angle`;
- `lt` means the same as `rt` but the other way (_ex.:_ `lt 90`);
- `pu`:<br>turtle stops drawing and moves more secretive;
- `pd`:<br>turtle starts drawing the line after itself;
- `clr` followed by a `color` (_ex.:_ `clr cyan`, `clr #fff`):<br>turtle changes line `color` to a new one;
- `repeat` followed by a `number` and \[array of commands\]:<br>turtle will repeat commands in the array `number` of times (can be nested).<br>_Examples:_ `repeat 3 [fd 100 rt 120]`, `repeat 4 [rt 90 repeat 36 [fd 10 rt 10] ]`;
- `bckgr` followed by a `color` (_ex.:_ `bckgr purple`, `bckgr #022a42`):<br>image will be filled with the new `color` ;
- `save`:<br>save an image drawn by the turtle (be careful with this one);
- `to` followed by a `name`:<br>create a method, callable by the `name`. To use the method call it by `name`.<br>_Example:_<br>`to triangle repeat 3 [fd 100 rt 120] end` <br>`triangle`.

[**Go, try them out!**](https://fabritsius.github.io/logo-code-editor/)

## Usage locally

1. Clone this repo (or obtain in other way);
2. In terminal go to the directory you have files in;
3. Enter `python3 -m http.server`;
4. Visit [localhost:8000](http://localhost:8000) in your browser.

  or double click on `index.html` after saving and unzipping this repo.

## Possible improvements

- add more examples into [./examples](./examples) directory
- add cheatsheet with commands to the web page (improve editor further).

## Links

- [Coding Challenge #121: Logo Interpreter](https://www.youtube.com/watch?v=i-k04yzfMpw)
- [Logo (programming language)](https://en.wikipedia.org/wiki/Logo_(programming_language))
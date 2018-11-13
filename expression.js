class Expression {
  constructor(type, left, right=undefined) {
    this.type  = type;
    this.left  = left;
    this.right = right;
  }

  eval() {
    if(this.type == '$') {
      return parseFloat(this.left);
    } else if(this.type == '/') {
      return this.left.eval() / this.right.eval();
    } else if(this.type == '*') {
      return this.left.eval() * this.right.eval();
    } else if(this.type == '-') {
      return this.left.eval() - this.right.eval();
    } else if(this.type == '+') {
      return this.left.eval() + this.right.eval();
    }
    return 0;
  }

  lvl() {
    if(this.type == '+') return 4;
    if(this.type == '-') return 3;
    if(this.type == '*') return 2;
    if(this.type == '/') return 1;
    return 0;
  }

}

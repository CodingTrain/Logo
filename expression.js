class Expression {
  constructor(type, left, right) {
    this.type  = type;
    this.left  = left;
    this.right = right;
  }

  eval(repcount) {
    if(this.type == '$') {
      if(this.left == 'repcount' && repcount) {
        return repcount;
      } else {
        return parseInt(this.left);
      }
    } else if(this.type == '/') { 
      return this.left.eval(repcount) / this.right.eval(repcount);
    } else if(this.type == '*') {
      return this.left.eval(repcount) * this.right.eval(repcount);
    } else if(this.type == '-') {
      return this.left.eval(repcount) - this.right.eval(repcount);
    } else if(this.type == '+') {
      return this.left.eval(repcount) + this.right.eval(repcount);
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

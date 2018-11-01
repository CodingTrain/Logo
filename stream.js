class Stream {
  constructor(buffer) {
		this.buffer = buffer;
		this.index = 0;
	}

  getPosition() {
    return this.index;
  }

  seekPosition(newPosition) {
    this.index = newPosition;
  }

	endOfStream() {
		return this.index >= this.buffer.length;
	}

	isDigit(chr) {
		return chr >= '0' && chr <= '9' || chr == '.' || chr == '-'
	}

	isLetter(chr) {
		return (chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z')
	}

	isWhitespace(chr) {
		switch (chr.charCodeAt(0)) {
			case 10: // Line feed
      case 13: // Carriage return
      case 32: // Space
      case 44: // Comma
        return true;
			default:
        return false;
		}
	}

	skipWhitespace() {
		while (this.isWhitespace(this.buffer.charAt(this.index))) this.index++;
	}

	readToken() {
		this.skipWhitespace();
    let chr = this.buffer.charAt(this.index);
    if (chr === '[' || chr === ']') return ++this.index, chr;
		let command = '';
    while (this.isLetter(chr = this.buffer.charAt(this.index))) command += chr, ++this.index;
		return command;
	}

	readNumber() {
		this.skipWhitespace();
		let command = '', chr;
    for (let chr; this.isDigit(chr = this.buffer.charAt(this.index)); ++this.index) command += chr;
		return Number(command);
	}
}

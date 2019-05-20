export default class StringStream {
  constructor(source) {
    this.source = source;
    this.position = 0;
  }

  getPosition() {
    return this.position;
  }

  next() {
    if (!this.hasNext()) {
      return null;
    }
    return this.source.charAt(this.position++);
  }

  hasNext() {
    return this.position < this.source.length;
  }

  peek() {
    if (!this.hasNext()) {
      return null;
    }
    return this.source.charAt(this.position);
  }

  skipToEnd() {
    this.position = this.source.length;
  }

  eat(str) {
    const subStr = this.source.substring(this.position, this.position + str.length);
    if (subStr !== str) {
      return null;
    }

    const result = {
      start: this.position,
      end: this.position + str.length,
      lexeme: subStr
    };
    this.position += str.length;
    return result;
  }

  eatWhile(fn) {
    const result = {
      start: this.position,
      end: this.position,
      lexeme: ''
    };

    if (fn instanceof RegExp) {
      const regexp = fn;
      fn = function checkEatWhile(char) {
        return regexp.test(char);
      };
    }

    while (this.hasNext() && fn(this.peek(), result.lexeme)) {
      result.lexeme += this.next();
    }

    result.end = this.position;

    return result;
  }
}

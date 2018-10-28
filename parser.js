class LogoParser {
    static parse(code) {
        let tokens = code.replace(/[\[\]]/g, (token) => { return ' ' + token + ' '; }).split(/\s/).map(token => token.trim()).filter(token => token !== '');
        let stack = this.buildStack(tokens);
        return stack;
    }

    static buildStack(tokens) {
        let stack = [];
    
        while (tokens.length > 0) {
            const token = tokens.shift();
            let parsed = this.parseToken(tokens, token);
            stack = stack.concat(parsed);
        }
    
        return stack;
    }
    
    static parseToken(stack, token, depth = 0) {
        switch (token) {
            case 'repeat':
                return this.parseRepeat(stack, ++depth);
            default:
                return [token];
        }
    }
    
    static parseRepeat(stack, depth) {
        const valid = stack.filter(command => command === ']').length >= depth;
        
        if (!valid) {
            return [];
        }
    
        let desiredTokens = [];
        const times = parseInt(stack.shift());
    
        stack.shift();
        let token = stack.shift();
    
        while(token != ']') {
            desiredTokens = desiredTokens.concat(this.parseToken(stack, token, depth));
            token = stack.shift();
        }
    
        let repeatStack = [];
    
        for (let i = 0; i < times; ++i) {
            repeatStack = repeatStack.concat(desiredTokens);
        }
    
        return repeatStack;
    }
}
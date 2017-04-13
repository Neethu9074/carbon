import CodeMirror from 'codemirror/lib/codemirror.js';

import { lex, getTokenForColumn } from 'in-stores/search/lexer';
import { getTree, aliasMap } from 'in-stores/search/fields';

CodeMirror.defineMode('instanaSearch', () => {
  return {
    currentLexResult: null,

    startState() {
      getTree();

      return {
        lexedFor: '',
        lexResult: null
      };
    },

    token(stream, state) {
      if (state.lexResult == null || stream.string !== state.lexedFor) {
        state.lexedFor = stream.string;
        this.currentLexResult = state.lexResult = lex(stream.string);
      }

      const token = getTokenForColumn(state.lexResult, stream.pos);
      // advance the codemirror stream so that we can style the next character
      stream.next();

      let classes = 'character';
      if (token) {
        classes += ` ${token.token}`;
      }

      // regex are unsupported, therefore error
      if (token.token === 'regex') {
        classes += ' error';
      }

      // if the current field path doesn't exist -> error
      if (token.token === 'field' && !aliasMap[token.lexeme]) {
        classes += ' error';
      }

      const blockId = token.blockId;
      if (blockId >= 0) {
        classes += ` custom-block`;
        classes += ` custom-blockId-${blockId}`;
        if (token.isBlockingStart) {
          classes += ` custom-block--start`;
        }
        if (token.isBlockingEnd) {
          classes += ` custom-block--end`;
        }
      }
      return classes;
    }
  };
});

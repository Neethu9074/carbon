import CodeMirror from 'codemirror/lib/codemirror.js';

import lexThirdStage from 'in-stores/search/lexer/thirdStage';
import {lex, getTokenForColumn} from 'in-stores/search/lexer';


CodeMirror.defineMode('instanaSearch', () => {
  return {
    currentLexResult: null,

    startState() {
      return {
        lexedFor: '',
        lexResult: null
      };
    },

    token(stream, state) {
      if (state.lexResult == null || stream.string !== state.lexedFor) {
        state.lexedFor = stream.string;
        this.currentLexResult = state.lexResult = lexThirdStage(lex(stream.string));
      }

      const token = getTokenForColumn(state.lexResult, stream.pos);
      // advance the codemirror stream so that we can style the next character
      stream.next();

      let classes = 'character';
      if (token) {
        classes += ` ${token.token}`;
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

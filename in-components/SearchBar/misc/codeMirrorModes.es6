import CodeMirror from 'codemirror/lib/codemirror.js';

import {getBlocks, getBlockForCursor} from 'in-components/SearchBar/stores/blocks';
import {lex, getTokenForColumn} from 'in-stores/search/lexer';


CodeMirror.defineMode('instanaSearch', () => {
  return {
    startState() {
      return {
        lexedFor: '',
        lexResult: null
      };
    },

    token(stream, state) {
      if (state.lexResult == null || stream.string !== state.lexedFor) {
        state.lexedFor = stream.string;
        state.lexResult = lex(stream.string);
        state.blocks = getBlocks(stream.string);
      }

      const token = getTokenForColumn(state.lexResult, stream.pos);
      // advance the codemirror stream so that we can style the next character
      stream.next();

      let classes = 'character';
      if (token) {
        classes += ` ${token.token}`;
      }

       // -1 -> pos starts at 1, cursor at 0
      const cursor = stream.pos - 1;

      const block = getBlockForCursor(state.blocks, cursor);
      if (block) {
        classes += ` custom-block`;
        if (block.isStart(cursor)) {
          classes += ` custom-block--start`;
        }
        if (block.isEnd(cursor)) {
          classes += ` custom-block--end`;
        }
      }
      return classes;
    }
  };
});

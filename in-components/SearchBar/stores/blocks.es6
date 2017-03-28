import {List, fromJS} from 'immutable';

import {refresh} from 'in-components/SearchBar/stores/filters';
import {createStore} from 'in-stores/store';
import {lex} from 'in-stores/search/lexer';


const blocks = createStore({
  name: 'SearchBar/stores/blocks',
  initialValue: List()
});

export const blocks$ = blocks.observable;

// represents the blocks as a query string (e.g. 'a AND b OR c AND')
export const query$ = blocks$.map(blocks => blocks.toArray().reduce((acc, block) => `${acc}${block.get('text')} ${block.get('operator')} ` , ''));


export function init() {
  refresh();
}

export function clear() {
  blocks.mutateTo(List());
}

export function addBlock(text) {
  if (text.trim().length === 0) {
    return;
  }

  blocks.applyStateMutation(all => {
    const block = createBlock({text});
    all = all.push(block);
    return applyOperatorsToPrevBlocks(all);
  });
}

export function deleteBlock(id) {
  blocks.applyStateMutation(all => {
    const indexOfBlockToBeDeleted = all.findIndex(b => b.get('id') === id);
    if (indexOfBlockToBeDeleted >= 0) {
      all = all.delete(indexOfBlockToBeDeleted);
    }
    return applyOperatorsToPrevBlocks(all);
  });
}

export function updateBlock({block, text, operator}) {
  const blockId = block.get('id');
  if (text != undefined && text.trim().length === 0) {
    return deleteBlock(blockId);
  }

  text = text || block.get('text');
  operator = operator || block.get('operator');

  blocks.applyStateMutation(all => {
    const indexOfBlockToBeUpdated = all.findIndex(b => b.get('id') === blockId);
    if (indexOfBlockToBeUpdated >= 0) {
      all = all.set(indexOfBlockToBeUpdated, createBlock({text, operator}));
    }
    return applyOperatorsToPrevBlocks(all);
  });
}

function applyOperatorsToPrevBlocks(blocks) {
  blocks.forEach((block, i) => {
    const currentBlock = block;
    if (currentBlock.getIn(['tokens', 0, 'token']) === 'operator') {
      // edge case: there is an operator at the beginning
      if (i > 0) {
        const prevBlock = blocks.get(i - 1);
        blocks = blocks.set(i - 1, createBlock({
          text: prevBlock.get('text'),
          operator: currentBlock.getIn(['tokens', 0, 'lexeme'])
        }));
      }

      // always delete operator blocks
      blocks = blocks.delete(i);
    }
  });
  return blocks;
}

export function generateBlocks(query) {
  let cursor = 0;
  let openingGroupers = 0; // tracks the number of opening (
  let openingQuotes = 0;  // tracks the number of opening "
  while(cursor < query.length) {
    const character = query[cursor];
    if (character === '(' && openingQuotes === 0) {
      openingGroupers++;
    }
    if (character === ')' && openingQuotes === 0) {
      openingGroupers = Math.max(0, openingGroupers - 1);
    }
    if (character === '"') {
      openingQuotes = openingQuotes % 2 === 1 ? 0 : 1;
    }

    if (character === ' ' && openingQuotes === 0 && openingGroupers === 0) {
      addBlock(query.substr(0, cursor));
      return generateBlocks(query.substr(cursor + 1));
    }
    cursor++;
  }
  return query;
}

let currentId = 0;
function createBlock({text, operator = 'AND'}) {
  return fromJS({
    id: currentId++,
    tokens: lex(text),
    operator,
    text
  });
}

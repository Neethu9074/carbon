export function getBlocks(query) {
  const blocks = [];
  generateBlocks(query, blocks, 0);
  return blocks;
}

export function generateBlocks(query, blocks, fromCursor) {
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
      const toCursor = fromCursor + cursor;
      const text = query.substr(0, cursor);
      if (text.trim().length > 0) {
        blocks.push(createBlock(fromCursor, toCursor, text));
      }
      return generateBlocks(query.substr(cursor + 1), blocks, toCursor + 1);
    }
    cursor++;
  }
  return query;
}

export function getBlockForCursor(blocks, cursor) {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (cursor >= block.start && cursor < block.end) {
      return block;
    }
  }
  return null;
}

function createBlock(start, end, text) {
  return {
    start,
    end,
    text: text,

    isStart: cursor => cursor === start,
    isEnd: cursor => cursor === end - 1
  };
}

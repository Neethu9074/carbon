import {parse as parseString} from 'in-services/search/queryParser';
import ParsingError from 'in-services/search/ParsingError';
import {getKeywordOperators} from 'in-sdk/search';

const allowedOperators = {
  number: ['<', '<=', '=', '>=', '>']
};

export function transformToLuceneQuery(query, contexts = ['entity']) {
  const queryParts = parseString(query);
  const keywordOperators = createKeywordBasedIndex(getKeywordOperators(contexts));

  let luceneQuery = '';

  while (queryParts.length > 0) {
    const queryPart = queryParts.shift();
    if (queryPart.type === 'freeText') {
      luceneQuery = `${luceneQuery} ${queryPart.text}`;
    } else if (queryPart.type === 'kv') {
      const kvLuceneQueryPart = transformKeyValueOperatorToLuceneQuery(keywordOperators, queryPart);
      luceneQuery = `${luceneQuery} ${kvLuceneQueryPart}`;
    }
  }

  return luceneQuery.trim();
}


function createKeywordBasedIndex(keywordOperators) {
  return keywordOperators
    .reduce((index, keywordOperator) => {
      index[keywordOperator.keyword] = keywordOperator;
      return index;
    }, {});
}


function transformKeyValueOperatorToLuceneQuery(keywordOperators, queryPart) {
  const key = queryPart.key;
  const keywordOperator = keywordOperators[key];

  if (!keywordOperator) {
    throw new ParsingError(`Unknown key ${key} at line ${queryPart.row}`);
  } else if (allowedOperators[keywordOperator.type].indexOf(queryPart.operator) === -1) {
    throw new ParsingError(`Unsupported operator ${queryPart.operator} for key ${key} at line ${queryPart.row}`);
  }

  return `${keywordOperator.field}:${queryPart.operator}${queryPart.value}`;
}

import {parse as parseString} from 'in-services/search/queryParser';
import ParsingError from 'in-services/search/ParsingError';
import {getKeywordOperators} from 'in-sdk/search';

const allowedOperators = {
  number: ['<', '<=', '=', '>=', '>']
};

const valueValidators = {
  number(s) {
    return !isNaN(Number(s));
  }
};

export function transformToLuceneQuery(query, contexts = ['entity']) {
  const queryParts = parseString(query);
  const keywordOperators = createKeywordBasedIndex(getKeywordOperators(contexts));

  let luceneQuery = '';

  while (queryParts.length > 0) {
    const queryPart = queryParts.shift();
    if (queryPart.type === 'freeText') {
      luceneQuery = `${luceneQuery} '${queryPart.text}'`;
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
  const value = queryPart.value;
  const row = queryPart.row;

  const keywordOperator = keywordOperators[key];

  if (!keywordOperator) {
    throw new ParsingError(`Unknown key ${key} at line ${row}.`);
  }

  const type = keywordOperator.type;
  if (allowedOperators[type].indexOf(queryPart.operator) === -1) {
    throw new ParsingError(`Unsupported operator ${queryPart.operator} for key ${key} at line ${row}.`);
  }


  const validator = valueValidators[type];
  if (validator && !validator(queryPart.value)) {
    throw new ParsingError(`Unsupported value ${value} for key ${key} at line ${row}. Expected type to be ${type}.`);
  }

  const luceneOperator = queryPart.operator === '=' ? '' : queryPart.operator;
  const luceneValue = type === 'string' ? `'${value}'` : value;
  return `${keywordOperator.field}:${luceneOperator}${luceneValue}`;
}

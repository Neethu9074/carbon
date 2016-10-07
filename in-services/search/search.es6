import {parse as parseString} from 'in-services/search/queryParser';
import ParsingError from 'in-services/search/ParsingError';
import {getKeywordOperators} from 'in-sdk/search';

const allowedOperators = {
  number: ['<', '<=', '=', '>=', '>'],
  string: ['=', '!='],
  selection: ['=', '!=']
};

const operatorTranslation = {
  '=': '',
  '!=': '-',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>='
};

const valueValidators = {
  number(s, keywordOperator, queryPart) {
    if (isNaN(Number(s))) {
      throw new ParsingError(
        `Unsupported value ${s} for key ${queryPart.key} at line ${queryPart.row}. Expected value to be a number.`,
        queryPart.row
      );
    }
  },
  selection(s, keywordOperator, queryPart) {
    if (keywordOperator.validate) {
      const error = keywordOperator.validate(s, queryPart);
      if (error) {
        throw new ParsingError(error, queryPart.row);
      }
    }
  }
};

const luceneValueConverters = {
  number(v) { return `${v}`; },
  string(v) {
    // for reference, see the escaping rules over here:
    // https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Escaping Special Characters
    const escapedValue = v
      .replace(/[\+\-\!\(\)\{\}\[\]\^\"\?\:\\\&\|\'\/]/g, c => {
        return `\\${c}`;
      });

    if (/ /.test(escapedValue)) {
      return `'${escapedValue}'`;
    }

    return escapedValue;
  },
  selection(v, keywordOperator) { return this.string(keywordOperator.toValue(v)); }
};


export function buildLuceneQuery(key, operator, value) {
  const luceneOperator = operator === '=' ? '' : operator;
  const luceneValue = luceneValueConverters.string(value);
  return `${key}:${luceneOperator}${luceneValue}`;
}


export function transformQuery(query, contexts = ['entity']) {
  const queryParts = parseString(query);
  const keywordOperators = createKeywordBasedIndex(getKeywordOperators(contexts));
  const result = {
    luceneQuery: '',
    queryParts
  };

  while (queryParts.length > 0) {
    const queryPart = queryParts.shift();
    if (queryPart.type === 'freeText') {
      const newFreeTextQueryPart = queryPart.text;
      result.luceneQuery = `${result.luceneQuery} ${luceneValueConverters.string(newFreeTextQueryPart)}`;
    } else if (queryPart.type === 'kv') {
      const kvLuceneQueryPart = transformKeyValueOperatorToLuceneQuery(keywordOperators, queryPart);
      result.luceneQuery = `${result.luceneQuery} ${kvLuceneQueryPart}`;
    }
  }

  result.luceneQuery = result.luceneQuery.trim();

  return result;
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
    throw new ParsingError(`Unknown key ${key} at line ${row}.`, queryPart.row);
  }

  const type = keywordOperator.type;
  if (allowedOperators[type].indexOf(queryPart.operator) === -1) {
    throw new ParsingError(
      `Unsupported operator ${queryPart.operator} for key ${key} at line ${row}.`,
      queryPart.row
    );
  }


  const validator = valueValidators[type];
  if (validator) {
    validator(queryPart.value, keywordOperator, queryPart);
  }

  const luceneOperator = operatorTranslation[queryPart.operator];
  const luceneValue = luceneValueConverters[type](value, keywordOperator);
  return `${keywordOperator.field}:${luceneOperator}${luceneValue}`;
}


export function getTagFiltersFromQuery(query) {
  try {
    return parseString(query)
      .filter(queryPart => queryPart.type === 'kv' && queryPart.key === 'tag')
      .map(queryPart => queryPart.value.toLowerCase());
  } catch (e) {
    // An error can occur when the current query is invalid. Swallowing the error
    // is fine in these cases.
    return [];
  }
}

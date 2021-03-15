/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const replacements = [
  'select',
  'update',
  'from',
  'where',
  'group by',
  'inner join',
  'outer join',
  'left join',
  'right join',
  'limit',
  'and',
  'order by',
  'explain'
].map(keyword => new RegExp('(?:^|\\s+)(' + keyword + ')\\s', 'ig'));

export function formatSql(statement) {
  if (!statement) {
    return statement;
  }

  let formattedStatement = statement;

  // we want to be in total control over line breaks
  formattedStatement = formattedStatement.replace(/\n/g, ' ');

  // remove empty comments
  formattedStatement = formattedStatement.replace(/\/\* *\*\//g, '');

  // convert all tabs to spaces
  formattedStatement = formattedStatement.replace(/\t/g, ' ');

  // remove multiple successive spaces
  formattedStatement = formattedStatement.replace(/ {2,}/g, ' ');

  // New line and indent on comma
  formattedStatement = formattedStatement.replace(/,/g, ',\n\t');

  replacements.forEach(replacement => {
    formattedStatement = formattedStatement.replace(replacement, (match, keyword) => {
      return '\n' + keyword.toUpperCase() + ' ';
    });
  });

  // Indent the AND
  formattedStatement = formattedStatement.replace(/\nAND /g, '\n\tAND ');

  return formattedStatement.trim();
}

export function shortenSqlStatement(sql) {
  if (!sql) {
    return sql;
  }

  sql = sql.trim().replace(/\n/g, ' ');
  const definitelySelect = isSelectStatement(sql);

  // INSERT and UPDATE statements are mostly at the beginning of an SQL query.
  // If the query contains a sub-select statement, the initial INSERT or UPDATE would be ignored if we first check against select.
  // Therefore, we should check against select at the very end
  if (!definitelySelect && isInsertStatement(sql)) {
    return shortenInsertStatement(sql);
  } else if (!definitelySelect && isUpdateStatement(sql)) {
    return shortenUpdateStatement(sql);
  } else if (isPotentialSelectStatement(sql)) {
    return shortenSelectStatement(sql);
  }

  return sql;
}

function isPotentialSelectStatement(sql) {
  return /\s*select.*from.*/i.test(sql);
}

function isSelectStatement(sql) {
  return /(^|^\s+)select\s/i.test(sql);
}

function isUpdateStatement(sql) {
  return /\s*update.*set.*/i.test(sql);
}

function isInsertStatement(sql) {
  return /\s*insert +into/i.test(sql);
}

function shortenSelectStatement(sql) {
  const match = sql.match(/\s+from\s+(([a-z0-9\-_.]+)|(`([^`]+)`)|("([^"]+)"))/i);
  if (!match) {
    return sql;
  }

  const count = sql.match(/\s*select\s+count(\s|\()/i) ? ' COUNT' : '';

  const from = match[2] || match[4] || match[6];
  let result = `SELECT${count} … FROM ${from}`;

  const explain = sql.match(/(^|\s+)explain\s+select\s+/i);
  if (explain) {
    result = `EXPLAIN ${result}`;
  }

  return result;
}

function shortenUpdateStatement(sql) {
  const match = sql.match(/\s*update +(([a-z0-9\-_]+)|(`([^`]+)`))/i);
  if (!match) {
    return sql;
  }

  const table = match[2] || match[4];
  return `UPDATE ${table} SET …`;
}

function shortenInsertStatement(sql) {
  const match = sql.match(/\s*insert +into +(([a-z0-9\-_]+)|(`([^`]+)`))/i);
  if (!match) {
    return sql;
  }

  const table = match[2] || match[4];
  return `INSERT INTO ${table} …`;
}

const replacements = [
    'select',
    'from',
    'where',
    'group by',
    'inner join',
    'outer join',
    'left join',
    'right join',
    'limit',
    'and',
    'order by'
  ]
  .map(keyword => new RegExp('\\s+(' + keyword + ')\\s', 'ig'));

export function formatSql(statement) {
  let formattedStatement = statement;

  // we want to be in total control over line breaks
  formattedStatement = formattedStatement.replace(/\n/g, ' ');

  replacements.forEach(replacement => {
    formattedStatement = formattedStatement.replace(replacement, (match, keyword) => {
      return '\n' + keyword.toUpperCase() + ' ';
    });
  });

  // remove empty comments
  formattedStatement = formattedStatement.replace(/\/\* *\*\//g, '');

  // convert all tabs to spaces
  formattedStatement = formattedStatement.replace(/\t/g, ' ');

  // remove multiple successive spaces
  formattedStatement = formattedStatement.replace(/ {2,}/g, ' ');

  return formattedStatement.trim();
}

export function shortenSqlStatement(sql) {
  sql = sql.trim().replace(/\n/g, ' ');
  if (isSelectStatement(sql)) {
    return shortenSelectStatement(sql);
  } else if (isUpdateStatement(sql)) {
    return shortenUpdateStatement(sql);
  } else if (isInsertStatement(sql)) {
    return shortenInsertStatement(sql);
  }

  return sql;
}

function isSelectStatement(sql) {
  return /.*select.*from.*/i.test(sql);
}

function isUpdateStatement(sql) {
  return /.*update.*set.*/i.test(sql);
}

function isInsertStatement(sql) {
  return /.*insert +into/i.test(sql);
}

function shortenSelectStatement(sql) {
  const match = sql.match(/.*?from +(([a-z0-9\-\_]+)|(\`([^\`]+)\`)).*/i);
  if (!match) {
    return sql;
  }

  const from = match[2] || match[4];
  const result = `SELECT … FROM ${from}`;
  return prependComments(sql, result);
}

function shortenUpdateStatement(sql) {
  const match = sql.match(/.*?update +(([a-z0-9\-\_]+)|(\`([^\`]+)\`)).*/i);
  if (!match) {
    return sql;
  }

  const table = match[2] || match[4];
  const result = `UPDATE ${table} SET …`;
  return prependComments(sql, result);
}

function shortenInsertStatement(sql) {
  const match = sql.match(/.*?insert +into +(([a-z0-9\-\_]+)|(\`([^\`]+)\`)).*/i);
  if (!match) {
    return sql;
  }

  const table = match[2] || match[4];
  const result = `INSERT INTO ${table} …`;
  return prependComments(sql, result);
}

function prependComments(sql, result) {
  const ormComment = sql.match(/^ *(\/\*.*?\*\/)/);
  if (ormComment) {
    result = `${ormComment[1]} ${result}`;
  }
  return result;
}

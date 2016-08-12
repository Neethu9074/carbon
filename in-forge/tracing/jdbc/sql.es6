const replacements = [
    'select',
    'from',
    'where',
    'group by',
    'inner join',
    'outer join',
    'limit',
    'and'
  ]
  .map(keyword => new RegExp('\\s+(' + keyword + ')\\s', 'ig'));

export function formatSql(statement) {
  let formattedStatement = statement;
  replacements.forEach(replacement => {
    formattedStatement = formattedStatement.replace(replacement, (match, keyword) => {
      return '\n' + keyword.toUpperCase() + ' ';
    });
  });
  return formattedStatement.trim();
}

export function shortenSqlStatement(sql) {
  if (isSelectStatement(sql)) {
    return shortenSelectStatement(sql);
  }

  return sql;
}

function isSelectStatement(sql) {
  return /^.*select.*from.*$/ig.test(sql);
}

function shortenSelectStatement(sql) {
  const from = sql.match(/.*?from ([a-z0-9\-\_]+)/i)[1];
  let result = `SELECT … FROM ${from}`;

  const ormComment = sql.match(/^ *(\/\*.*?\*\/)/);
  if (ormComment) {
    result = `${ormComment[1]} ${result}`;
  }

  return result;
}

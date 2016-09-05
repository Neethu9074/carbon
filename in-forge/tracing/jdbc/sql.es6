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
  if (isSelectStatement(sql)) {
    return shortenSelectStatement(sql);
  }

  return sql;
}

function isSelectStatement(sql) {
  return /^.*select.*from.*$/ig.test(sql);
}

function shortenSelectStatement(sql) {
  const match = sql.match(/.*?from ([a-z0-9\-\_]+)/i);
  if (!match) {
    return sql;
  }

  const from = match[1];
  let result = `SELECT … FROM ${from}`;

  const ormComment = sql.match(/^ *(\/\*.*?\*\/)/);
  if (ormComment) {
    result = `${ormComment[1]} ${result}`;
  }

  return result;
}

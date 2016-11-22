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
  return /\s*select.*from.*/i.test(sql);
}

function isUpdateStatement(sql) {
  return /\s*update.*set.*/i.test(sql);
}

function isInsertStatement(sql) {
  return /\s*insert +into/i.test(sql);
}

function shortenSelectStatement(sql) {
  const match = sql.match(/\s+from +(([a-z0-9\-\_]+)|(\`([^\`]+)\`))/i);
  if (!match) {
    return sql;
  }

  const count = sql.match(/\s*select\s+count(\s|\()/i) ? ' COUNT' : '';

  const from = match[2] || match[4];
  const result = `SELECT${count} … FROM ${from}`;
  return result;
}

function shortenUpdateStatement(sql) {
  const match = sql.match(/\s*update +(([a-z0-9\-\_]+)|(\`([^\`]+)\`))/i);
  if (!match) {
    return sql;
  }

  const table = match[2] || match[4];
  return `UPDATE ${table} SET …`;
}

function shortenInsertStatement(sql) {
  const match = sql.match(/\s*insert +into +(([a-z0-9\-\_]+)|(\`([^\`]+)\`))/i);
  if (!match) {
    return sql;
  }

  const table = match[2] || match[4];
  return `INSERT INTO ${table} …`;
}

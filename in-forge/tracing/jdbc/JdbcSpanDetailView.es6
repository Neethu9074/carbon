import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Code from 'in-components/Code';

const keywords = [
  'select',
  'from',
  'where',
  'group by',
  'limit',
  'and'
];

const replacements = keywords.map(keyword => new RegExp('\\s+(' + keyword + ')\\s', 'ig'));

function formatSql(statement) {
  let formattedStatement = statement;
  replacements.forEach(replacement => {
    formattedStatement = formattedStatement.replace(replacement, (match, keyword) => {
      return '\n' + keyword.toUpperCase() + ' ';
    });
  });
  return formattedStatement.trim();
}

export default function JdbcSpanDetailView({span}) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Connection'>
          {span.getIn(['data', 'jdbc', 'connection'])}
        </DescriptionItem>
      </DescriptionList>
      {statement ?
        <Code code={formatSql(statement)}
              type='sql' />
      : null}
    </div>
  );
}

import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Code from 'in-components/Code';

export default function MongoSpanDetailView({span}) {
  const query = getQueryForFormatting(span);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Service'>
          {span.getIn(['data', 'mongo', 'service'])}
        </DescriptionItem>
        <DescriptionItem title='Protocol'>
          {span.getIn(['data', 'mongo', 'protocol'])}
        </DescriptionItem>
      </DescriptionList>

      {query ?
        <Code code={query}
              type='json' />
      : null}
    </div>
  );
}


function getQueryForFormatting(span) {
  let query = '';

  const commandName = span.getIn(['data', 'mongo', 'command']);
  const command = span.getIn(['data', 'mongo', 'json']);
  const filter = span.getIn(['data', 'mongo', 'filter']);

  if (filter) {
    query += `// Filter:\n`;

    try {
      query += JSON.stringify(JSON.parse(filter), 0, 2);
    } catch (e) {
      // ignore filter parsing errors
      query += filter;
    }

    query += '\n\n';
  }

  if (command) {
    if (commandName) {
      query += `// Command: ${commandName}\n`;
    }

    try {
      query += JSON.stringify(JSON.parse(command), 0, 2);
    } catch (e) {
      // ignore command parsing errors
      query += command;
    }
  }


  if (query.length > 0) {
    return query.trim();
  }
  return null;
}

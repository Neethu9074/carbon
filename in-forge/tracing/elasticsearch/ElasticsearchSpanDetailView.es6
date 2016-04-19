import React from 'react';

import Code from 'in-components/Code';

export default function ElasticsearchSpanDetailView({span}) {
  const query = span.getIn(['data', 'elasticsearch', 'action']);
  return (
    <div>
      {query ?
        <Code code={JSON.stringify(query, 0, 2)}
              type='json' />
      : null}
    </div>
  );
}

import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Code from 'in-components/Code';

export default function ElasticsearchSpanDetailView({span}) {
  const query = span.getIn(['data', 'elasticsearch', 'query']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Action'>
          {span.getIn(['data', 'elasticsearch', 'action'])}
        </DescriptionItem>
        <DescriptionItem title='Index'>
          {span.getIn(['data', 'elasticsearch', 'index'])}
        </DescriptionItem>
        <DescriptionItem title='Type'>
          {span.getIn(['data', 'elasticsearch', 'type'])}
        </DescriptionItem>
        <DescriptionItem title='Hits'>
          {span.getIn(['data', 'elasticsearch', 'hits'])}
        </DescriptionItem>
        <DescriptionItem title='Error'>
          {span.getIn(['data', 'elasticsearch', 'error'])}
        </DescriptionItem>

        {query ?
          <DescriptionItem title='Query'>
            <Code code={prettyPrintQuery(query)}
                  lang='json' />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
}


function prettyPrintQuery(query) {
  let json;
  try {
    json = JSON.parse(query);
  } catch (e) {
    return query;
  }

  if (json.query_binary) {
    const binaryQuery = json.query_binary;

    try {
      json.query_binary_decoded = atob(binaryQuery);
    } catch (e) {
      // Queries may be trucnated to save space. Decoding
      // is only an optional service.
    }
  }

  return JSON.stringify(json, 0, 2);
}

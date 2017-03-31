import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function HttpSpanDetailView({ span }) {
  const url = span.getIn(['data', 'http', 'url']);
  let path;
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    path = a.pathname;
  }

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Host">
          {span.getIn(['data', 'http', 'host'])}
        </DescriptionItem>
        {path
          ? <DescriptionItem title="Request Path">
              {path}
            </DescriptionItem>
          : null}
        {url && url !== path
          ? <DescriptionItem title="URL">
              {url}
            </DescriptionItem>
          : null}
        <DescriptionItem title="Parameters">
          {span.getIn(['data', 'http', 'params'])}
        </DescriptionItem>
        <DescriptionItem title="Method">
          {span.getIn(['data', 'http', 'method'])}
        </DescriptionItem>
        <DescriptionItem title="Status Code">
          {span.getIn(['data', 'http', 'status'])}
        </DescriptionItem>
        <DescriptionItem title="Content Length">
          {span.getIn(['data', 'http', 'size'], span.getIn(['data', 'net', 'in']))}
        </DescriptionItem>
        <DescriptionItem title="Request Header Length">
          {span.getIn(['data', 'net', 'out'])}
        </DescriptionItem>
        <DescriptionItem title="Remote Address">
          {span.getIn(['data', 'peer', 'ip'])}
        </DescriptionItem>
        <DescriptionItem title="Remote Port">
          {span.getIn(['data', 'peer', 'port'])}
        </DescriptionItem>
        <DescriptionItem title="Error">
          {span.getIn(['data', 'http', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

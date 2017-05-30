import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function HttpSpanGroupingDetailView({ span }) {
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
        {url && url !== path
          ? <DescriptionItem title="URL">
              {url}
            </DescriptionItem>
          : null}
        <DescriptionItem title="Method">
          {span.getIn(['data', 'http', 'method'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

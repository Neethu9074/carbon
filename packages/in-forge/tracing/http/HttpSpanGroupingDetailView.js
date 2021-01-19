/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

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
      <Dl>
        <Di title="Host">{span.getIn(['data', 'http', 'host'])}</Di>
        {url && url !== path ? <Di title="URL">{url}</Di> : null}
        <Di title="Method">{span.getIn(['data', 'http', 'method'])}</Di>
      </Dl>
    </div>
  );
}

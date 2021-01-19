/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function WordpressSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Action">{span.getIn(['data', 'wp', 'action'])}</Di>
        <Di title="Template">{span.getIn(['data', 'wp', 'view'])}</Di>
        <Di title="Post Title">{span.getIn(['data', 'wp', 'post_title'])}</Di>
      </Dl>
    </div>
  );
}

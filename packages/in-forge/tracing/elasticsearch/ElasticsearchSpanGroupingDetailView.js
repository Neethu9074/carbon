/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ElasticsearchSpanGroupingDetailView({ span }) {
  return (
    <Dl>
      <Di title="Action">{span.getIn(['data', 'elasticsearch', 'action'])}</Di>
      <Di title="Index">{span.getIn(['data', 'elasticsearch', 'index'])}</Di>
    </Dl>
  );
}

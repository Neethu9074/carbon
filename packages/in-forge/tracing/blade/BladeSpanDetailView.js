/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function BladeSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="View Name">{span.getIn(['data', 'blade', 'view'])}</Di>
        <Di title="View Path">{span.getIn(['data', 'blade', 'path'])}</Di>
        <Di title="Subtemplate Count">{span.getIn(['data', 'blade', 'subtemplate_count'])}</Di>
      </Dl>
    </div>
  );
}

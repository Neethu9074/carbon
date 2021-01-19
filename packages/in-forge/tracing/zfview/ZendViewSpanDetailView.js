/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ZendViewSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Subtemplate Count">{span.getIn(['data', 'zfview', 'subtemplate_count'])}</Di>
        <Di title="Renderer">{span.getIn(['data', 'zfview', 'renderer'])}</Di>
        <Di title="Template">{span.getIn(['data', 'zfview', 'template'])}</Di>
      </Dl>
    </div>
  );
}

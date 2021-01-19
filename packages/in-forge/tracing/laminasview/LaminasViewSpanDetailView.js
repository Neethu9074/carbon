/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LaminasViewSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Subtemplate Count">{span.getIn(['data', 'laminasview', 'subtemplate_count'])}</Di>
        <Di title="Renderer">{span.getIn(['data', 'laminasview', 'renderer'])}</Di>
        <Di title="Template">{span.getIn(['data', 'laminasview', 'template'])}</Di>
      </Dl>
    </div>
  );
}

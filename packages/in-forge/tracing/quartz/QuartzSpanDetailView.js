/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function QuartzSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Group">{span.getIn(['data', 'quartz', 'group'])}</Di>
      <Di title="Name">{span.getIn(['data', 'quartz', 'name'])}</Di>
      <Di title="Type">{span.getIn(['data', 'quartz', 'type'])}</Di>
    </Dl>
  );
}

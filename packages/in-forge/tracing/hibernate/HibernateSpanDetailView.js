/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HibernateSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Mode">{span.getIn(['data', 'hibernate', 'mode'])}</Di>
      <Di title="ID">{span.getIn(['data', 'hibernate', 'id'])}</Di>
    </Dl>
  );
}

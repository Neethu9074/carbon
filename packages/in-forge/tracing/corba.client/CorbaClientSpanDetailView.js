/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function CorbaClientSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Method">{span.getIn(['data', 'corba', 'method'])}</Di>
        <Di title="ORB">{span.getIn(['data', 'corba', 'orb'])}</Di>
      </Dl>
    </div>
  );
}

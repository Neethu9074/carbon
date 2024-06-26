/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { LoadingSkeleton, KeyValue } from '@instana/components';

import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import connect from 'in-hoc/connectTo';

import locals from './GroupingTable.mless';

export default connect(({ id, groupbyTag }) => {
  const observables = {};
  if (groupbyTag === 'application.id') {
    observables.label = getApplication({ id }).map(getLabel);
  }
  if (groupbyTag === 'service.id') {
    observables.label = getServiceLabel({ id }).map(getLabel);
  }
  if (groupbyTag === 'endpoint.id') {
    observables.label = getEndpointInfo({ id }).map(getLabel);
  }
  return observables;
})(GroupByKeyValue);

function GroupByKeyValue({ label, groupbyTag }) {
  if (!label) {
    return <LoadingSkeleton className={locals.labelSkeleton} />;
  }
  return (
    <>
      <KeyValue
        label={<span className={locals.groupLabel}>{getByTitle(groupbyTag)}</span>}
        customValue={label}
        accentuated
      />
    </>
  );
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getByTitle(groupbyTag) {
  if (groupbyTag === 'application.id') {
    return 'Application.name';
  }
  if (groupbyTag === 'service.id') {
    return 'Service.name';
  }
  if (groupbyTag === 'endpoint.id') {
    return 'Endpoint.name';
  }
}

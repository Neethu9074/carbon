/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import EntityWithIcon from 'in-new-components/EntityWithIcon';
import { Li } from 'in-new-components/lists/List';

import locals from './ServiceLiveListItem.mless';

export default function ServiceLiveListItem({ item }) {
  const technologies = item?.technologies;
  const technologiesNoK8s = technologies?.filter(s => !s.startsWith('kubernetes'));
  const types = item?.types.filter(type => type !== 'UNDEFINED');
  return (
    <Li className={locals.listItem}>
      <EntityWithIcon icon={'lib_application_service'} label={item.label} technologies={technologiesNoK8s} />
      <div>
        <EndpointTypeBadgeList types={types} />
      </div>
    </Li>
  );
}

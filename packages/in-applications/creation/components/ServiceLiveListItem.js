import React from 'react';

import EntityWithIcon from 'in-new-components/EntityWithIcon';

import locals from './ServiceLiveListItem.mless';

export default function ServiceLiveListItem({ item }) {
  const technologies = item?.service?.technologies;
  const technologiesNoK8s = technologies?.filter(s => !s.startsWith('kubernetes'));
  return (
    <li className={locals.listItem}>
      <EntityWithIcon icon={'lib_application_service'} label={item.service.label} technologies={technologiesNoK8s} />
    </li>
  );
}

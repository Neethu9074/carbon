import React from 'react';

import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import FilterPreview from 'in-analyze/Filter/FilterPreview';
import theme from 'in-themes/theme';

import locals from './CollapsedContent.mless';

export default function CollapsedContent({ filters, onClick }) {
  const filtersAsItemList = [];

  const application = filters.getIn(['applicationFilter', APPLICATION.id]);
  const service = filters.getIn(['applicationFilter', SERVICE.id]);
  const endpoint = filters.getIn(['applicationFilter', ENDPOINT.id]);

  if (application) {
    filtersAsItemList.push({
      label: application.get('value'),
      icon: application.get('icon')
    });
  }
  if (service) {
    filtersAsItemList.push({
      label: service.get('value'),
      icon: service.get('icon')
    });
  }
  if (endpoint) {
    filtersAsItemList.push({
      label: endpoint.get('value'),
      icon: endpoint.get('icon')
    });
  }

  for (let i = 0; i < filters.get('tagFilter').size; i++) {
    const tag = filters.getIn(['tagFilter', i]);
    filtersAsItemList.push({
      label: tag.get('name'),
      icon: tag.get('icon')
    });
  }

  const groupLabel = filters.getIn(['group', 'label']);
  return (
    <div className={locals.content} onClick={onClick}>
      <FilterPreview title="Source" isStatic items={[{ icon: 'lib_application_trace', label: 'Calls' }]} />

      {filtersAsItemList.length > 0 && <FilterPreview title="Filters" items={filtersAsItemList} />}

      {groupLabel && <FilterPreview title="Group" items={[{ label: groupLabel, color: theme.lib.colors.success }]} />}
    </div>
  );
}

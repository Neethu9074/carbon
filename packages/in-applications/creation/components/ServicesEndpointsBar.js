import React from 'react';

import AnalyzeMultiSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeMultiSelectBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { getTagFromList } from 'in-applications/tags';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ServicesEndpointsBar.mless';

export default function ServicesEndpointsBar(props) {
  const { tagFilters, onMoreClick, timeConfig, withoutFiltersLabel, addTagFilter } = props;

  const serviceNameTags = tagFilters.filter(tag => tag.name === 'service.name');

  return (
    <Bar withoutLabel={withoutFiltersLabel} showClearFilters={false}>
      <AnalyzeMultiSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="service.name"
        singularLabel="Service"
        pluralLabel="Services"
        selectedItemRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        withoutTextTransform
        addTagFilter={addTagFilter}
      />
      <AnalyzeMultiSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="endpoint.name"
        singularLabel="Endpoint"
        pluralLabel="Endpoints"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_endpoint')}
        selectedItemRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        precondition={() => !!getTagFromList(tagFilters, { name: 'service.name' }) && serviceNameTags.length < 2}
        preconditionFailedTooltip="Please select a single service before selecting endpoints."
        withoutTextTransform
        addTagFilter={addTagFilter}
      />
      {onMoreClick && <MoreBarItem {...props} onClick={onMoreClick} />}
    </Bar>
  );
}

function renderApplicationServiceEndpointItem(icon) {
  return function ItemLabel(itemLabel) {
    return (
      <>
        <SvgIcon className={locals.entityIcon} type={icon} />
        <span className={locals.itemText}>{itemLabel}</span>
      </>
    );
  };
}

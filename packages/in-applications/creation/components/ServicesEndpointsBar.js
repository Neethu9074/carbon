/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AnalyzeMultiSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeMultiSelectBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { getTagFromList } from 'in-applications/tags';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

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
        singularLabel={t('in-applications:analyze.quickFilter.labelService', { count: 1 })}
        pluralLabel={t('in-applications:analyze.quickFilter.labelService', { count: 2 })}
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
        singularLabel={t('in-applications:analyze.quickFilter.labelEndpoint', { count: 1 })}
        pluralLabel={t('in-applications:analyze.quickFilter.labelEndpoint', { count: 2 })}
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_endpoint')}
        selectedItemRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        precondition={() => !!getTagFromList(tagFilters, { name: 'service.name' }) && serviceNameTags.length < 2}
        preconditionFailedTooltip={t('in-applications:creation.tooltipEndpointBar')}
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

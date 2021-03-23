/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React, { Fragment } from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import AnalyzeMultiSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeMultiSelectBarItem';
import AnalyzeSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeSelectBarItem';
import CheckboxBarItem from 'in-analyze/components/filterBar/CheckboxBarItem';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import BooleanBarItem from 'in-analyze/components/filterBar/BooleanBarItem';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { millis } from 'in-services/formatters/number';
import { getTagFromList } from 'in-applications/tags';
import { toTitleCase } from 'in-services/util/string';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';

import locals from './QuickFilterBar.mless';

export default function QuickFilterBar(props) {
  const {
    filters,
    clearTagFilters,
    onMoreClick,
    showHiddenCallsSelector = true,
    showLatencySelector = true,
    excludedTagFilters = []
  } = props;
  const dataSourceConfig = getConfigByDataSource(filters.dataSource);

  const tagFilters = filters.tagFilter;
  const timeConfig = filters.timeConfig;

  const isNotExcluded = tagFilter => !excludedTagFilters.includes(tagFilter);

  return (
    <Bar showClearFilters={tagFilters.length > 0} onClearFilters={clearTagFilters}>
      {isNotExcluded('application.name') && (
        <AnalyzeSelectBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag="application.name"
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.application')}
          pluralLabel={t('in-analyze:analyzeView.quickFilterBarLabel.application', { count: 2 })}
          itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application')}
          withoutTextTransform
        />
      )}
      {isNotExcluded('service.name') && (
        <AnalyzeSelectBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag="service.name"
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.service')}
          pluralLabel={t('in-analyze:analyzeView.quickFilterBarLabel.service', { count: 2 })}
          itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
          withoutTextTransform
        />
      )}
      {isNotExcluded('endpoint.name') && (
        <AnalyzeSelectBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag="endpoint.name"
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.endpoint')}
          pluralLabel={t('in-analyze:analyzeView.quickFilterBarLabel.endpoint', { count: 2 })}
          itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_endpoint')}
          precondition={() => !!getTagFromList(tagFilters, { name: 'service.name' })}
          preconditionFailedTooltip="Please select a service before selecting an endpoint."
          withoutTextTransform
        />
      )}
      {isNotExcluded('call.type') && (
        <AnalyzeSelectBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag="call.type"
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.type')}
          pluralLabel={t('in-analyze:analyzeView.quickFilterBarLabel.type', { count: 2 })}
          selectedItemRenderer={renderType}
          itemLabelRenderer={renderType}
        />
      )}
      {isNotExcluded('technology') && (
        <AnalyzeMultiSelectBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag="technology"
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.technology')}
          pluralLabel={t('in-analyze:analyzeView.quickFilterBarLabel.technology', { count: 2 })}
          selectedItemRenderer={getTechnologyLabel}
          itemLabelRenderer={itemLabel => (
            <EntityWithTypeAndIcon plugin={itemLabel} label={getTechnologyLabel(itemLabel)} />
          )}
        />
      )}
      {showLatencySelector && isNotExcluded(dataSourceConfig.latencyTagPreset) && (
        <NumberBarItem
          {...props}
          tagFilters={tagFilters}
          tag={dataSourceConfig.latencyTagPreset}
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.latency')}
          formatter={millis.fixedCompact}
          unit="ms"
          showRange
          minValue="1"
        />
      )}
      {isNotExcluded(dataSourceConfig.errorneousTagPreset) && (
        <BooleanBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag={dataSourceConfig.errorneousTagPreset}
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.erroneous')}
        />
      )}
      {showHiddenCallsSelector && (
        <CheckboxBarItem
          {...props}
          timeConfig={timeConfig}
          tagFilters={tagFilters}
          tag={{ synthetic: 'include_synthetic', internal: 'include_internal' }}
          singularLabel={t('in-analyze:analyzeView.quickFilterBarLabel.hiddenCalls')}
        />
      )}

      {onMoreClick && <MoreBarItem {...props} onClick={onMoreClick} />}
    </Bar>
  );
}

function renderApplicationServiceEndpointItem(icon) {
  return function ItemLabel(itemLabel) {
    return (
      <Fragment>
        <SvgIcon className={locals.entityIcon} type={icon} />
        <span className={locals.itemText}>{itemLabel}</span>
      </Fragment>
    );
  };
}

function renderType(typeLabel) {
  if (typeLabel === 'HTTP' || typeLabel === 'RPC') {
    return typeLabel;
  }
  return toTitleCase(typeLabel);
}

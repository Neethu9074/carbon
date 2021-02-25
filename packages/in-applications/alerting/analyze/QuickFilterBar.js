/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import AnalyzeMultiSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeMultiSelectBarItem';
import AnalyzeSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeSelectBarItem';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import BooleanBarItem from 'in-analyze/components/filterBar/BooleanBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { millis } from 'in-services/formatters/number';
import { getTagFromList } from 'in-applications/tags';
import { toTitleCase } from 'in-services/util/string';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './QuickFilterBar.mless';

export default function QuickFilterBar(props) {
  const { tagFilters, onMoreClick, timeConfig, withoutFiltersLabel, withoutLatencyItem } = props;

  return (
    <Bar showClearFilters={false} withoutLabel={withoutFiltersLabel}>
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="service.name"
        singularLabel={t('in-applications:analyze.quickFilter.labelService', { count: 1 })}
        pluralLabel={t('in-applications:analyze.quickFilter.labelService', { count: 2 })}
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        withoutTextTransform
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="endpoint.name"
        singularLabel={t('in-applications:analyze.quickFilter.labelEndpoint', { count: 1 })}
        pluralLabel={t('in-applications:analyze.quickFilter.labelEndpoint', { count: 2 })}
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_endpoint')}
        precondition={() => !!getTagFromList(tagFilters, { name: 'service.name' })}
        preconditionFailedTooltip={t('in-applications:analyze.quickFilter.preconditionFailedTooltip')}
        withoutTextTransform
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="call.type"
        singularLabel={t('in-applications:analyze.quickFilter.labelType', { count: 1 })}
        pluralLabel={t('in-applications:analyze.quickFilter.labelType', { count: 2 })}
        selectedItemRenderer={renderType}
        itemLabelRenderer={renderType}
      />
      <AnalyzeMultiSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="technology"
        singularLabel={t('in-applications:analyze.quickFilter.labelTechnology', { count: 1 })}
        pluralLabel={t('in-applications:analyze.quickFilter.labelTechnology', { count: 2 })}
        selectedItemRenderer={getTechnologyLabel}
        itemLabelRenderer={itemLabel => (
          <EntityWithTypeAndIcon plugin={itemLabel} label={getTechnologyLabel(itemLabel)} />
        )}
      />
      {!withoutLatencyItem && (
        <NumberBarItem
          {...props}
          tagFilters={tagFilters}
          tag="call.latency"
          singularLabel={t('in-applications:analyze.quickFilter.labelLatency')}
          formatter={millis.fixedCompact}
          unit="ms"
          showRange
          minValue="1"
        />
      )}
      <BooleanBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="call.erroneous"
        singularLabel={t('in-applications:analyze.quickFilter.labelErroneous')}
      />
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

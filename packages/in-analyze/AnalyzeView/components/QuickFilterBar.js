import React, { Fragment } from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import AnalyzeSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeSelectBarItem';
import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
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
  const { filters, clearTagFilters, onMoreClick } = props;
  const dataSourceConfig = getConfigByDataSource(filters.dataSource);

  const tagFilters = filters.tagFilter;
  const timeConfig = filters.timeConfig;

  return (
    <Bar showClearFilters={tagFilters.length > 0} onClearFilters={clearTagFilters}>
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="application.name"
        singularLabel="Application"
        pluralLabel="Application"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application')}
        withoutTextTransform
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="service.name"
        singularLabel="Service"
        pluralLabel="Services"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
        withoutTextTransform
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="endpoint.name"
        singularLabel="Endpoint"
        pluralLabel="Endpoints"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_endpoint')}
        precondition={() => !!getTagFromList(tagFilters, { name: 'service.name' })}
        preconditionFailedTooltip="Please select a service before selecting an endpoint."
        withoutTextTransform
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="call.type"
        singularLabel="Type"
        pluralLabel="Types"
        selectedItemRenderer={renderType}
        itemLabelRenderer={renderType}
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="call.technology"
        singularLabel="Technology"
        pluralLabel="Technologies"
        selectedItemRenderer={getTechnologyLabel}
        itemLabelRenderer={itemLabel => (
          <TechnologyLabelWithIcon plugin={itemLabel} label={getTechnologyLabel(itemLabel)} is10Icon />
        )}
      />
      <NumberBarItem
        {...props}
        tagFilters={tagFilters}
        tag={dataSourceConfig.latencyTagPreset}
        singularLabel="Latency"
        formatter={millis.fixedCompact}
        unit="ms"
        showRange
        minValue="1"
      />
      <BooleanBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag={dataSourceConfig.errorneousTagPreset}
        singularLabel="Erroneous"
      />
      <BooleanBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag={dataSourceConfig.isSyntheticTagPreset}
        singularLabel="Synthetic"
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

import React, { Fragment } from 'react';

import NumberBarItem from 'in-new-components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import AnalyzeSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeSelectBarItem';
import AnalyzeMoreBarItem from 'in-analyze/AnalyzeView/components/AnalyzeMoreBarItem';
import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import BooleanBarItem from 'in-new-components/filterBar/BooleanBarItem';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getTagFromList } from 'in-applications/tags';
import Bar from 'in-new-components/filterBar/Bar/Bar';
import { toTitleCase } from 'in-services/util/string';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';

import locals from './QuickFilterBar.mless';

export default function QuickFilterBar(props) {
  const { filters, clearTagFilters, filterAddedTracker, filterChangedTracker, filterRemovedTracker } = props;
  const dataSourceConfig = getConfigByDataSource(filters.get('dataSource'));

  const tagFilters = filters.get('tagFilter').toJS();
  const timeConfig = filters.get('timeConfig');

  return (
    <Bar
      showClearFilters={tagFilters.length > 0}
      onClearFilters={clearTagFilters}
      filterAddedTracker={filterAddedTracker}
      filterChangedTracker={filterChangedTracker}
      filterRemovedTracker={filterRemovedTracker}
    >
      {/*
      TODOs:
      - Render selected technology item
      - review
      */}
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="application.name"
        singularLabel="Application"
        pluralLabel="Application"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application')}
      />
      <AnalyzeSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="service.name"
        singularLabel="Service"
        pluralLabel="Services"
        itemLabelRenderer={renderApplicationServiceEndpointItem('lib_application_service')}
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
        unit="ms"
        showRange
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
      <AnalyzeMoreBarItem {...props} label="More" />
    </Bar>
  );
}

function renderApplicationServiceEndpointItem(icon) {
  return function ItemLabel(itemLabel) {
    return (
      <Fragment>
        <SvgIcon className={locals.entityIcon} type={icon} width={24} height={24} />
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

import React, { Fragment } from 'react';

import AnalyzeSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeSelectBarItem';
import { tagFilter as tagFilterMatrixParameter } from 'in-analyze/navigation/matrix';
import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import BooleanBarItem from 'in-new-components/filterBar/BooleanBarItem';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { createTracker } from 'in-services/tracking/mixpanel';
import { getTagFromList } from 'in-applications/tags';
import Bar from 'in-new-components/filterBar/Bar/Bar';
import { toTitleCase } from 'in-services/util/string';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';

import locals from './QuickFilterBar.mless';

const filterClearedTracker = createTracker('analyze.filter.cleared');

export default function QuickFilterBar(props) {
  const { filters, onChangeAnalyzeConfig } = props;
  const dataSourceConfig = getConfigByDataSource(filters.get('dataSource'));

  const tagFilters = filters.get('tagFilter').toJS();
  const timeConfig = filters.get('timeConfig');

  return (
    <Bar showClearFilters={tagFilters.length > 0} onClearFilters={() => clearTagFilters(onChangeAnalyzeConfig)}>
      {/*
      TODOs:
      - Mixpanel trackers
      - The "More" filter dialog/tagFiltersHoc#onMoreClick
      - tagFilterHoc#onTagFilterClick
      - rm console.logs
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
      <BooleanBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag={dataSourceConfig.errorneousTagPreset}
        singularLabel="Erroneous"
        pluralLabel="Erroneous"
      />
      <BooleanBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag={dataSourceConfig.isSyntheticTagPreset}
        singularLabel="Synthetic"
        pluralLabel="Synthetic"
      />
    </Bar>
  );
}

function clearTagFilters(onChangeAnalyzeConfig) {
  onChangeAnalyzeConfig({
    [tagFilterMatrixParameter]: []
  });
  filterClearedTracker();
}

function renderApplicationServiceEndpointItem(icon) {
  return function(itemLabel) {
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

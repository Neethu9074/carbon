import React, { Fragment } from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import AnalyzeMultiSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeMultiSelectBarItem';
import AnalyzeSelectBarItem from 'in-analyze/AnalyzeView/components/AnalyzeSelectBarItem';
import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import BooleanBarItem from 'in-analyze/components/filterBar/BooleanBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { millis } from 'in-services/formatters/number';
import { getTagFromList } from 'in-applications/tags';
import { toTitleCase } from 'in-services/util/string';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';

import locals from './QuickFilterBar.mless';

export default function QuickFilterBar(props) {
  const { tagFilters, onMoreClick, timeConfig, withoutFiltersLabel, withoutLatencyItem } = props;
  return (
    <Bar showClearFilters={false} withoutFiltersLabel={withoutFiltersLabel}>
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
      <AnalyzeMultiSelectBarItem
        {...props}
        timeConfig={timeConfig}
        tagFilters={tagFilters}
        tag="technology"
        singularLabel="Technology"
        pluralLabel="Technologies"
        selectedItemRenderer={getTechnologyLabel}
        itemLabelRenderer={itemLabel => (
          <TechnologyLabelWithIcon plugin={itemLabel} label={getTechnologyLabel(itemLabel)} is10Icon />
        )}
      />
      {!withoutLatencyItem && (
        <NumberBarItem
          {...props}
          tagFilters={tagFilters}
          tag="call.latency"
          singularLabel="Latency"
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
        tag="call.erroneus"
        singularLabel="Erroneous"
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

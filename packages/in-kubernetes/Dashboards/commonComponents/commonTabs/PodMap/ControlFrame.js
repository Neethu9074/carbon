/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonRadioButtonGroup, CarbonRadioButton } from '@instana/components';

import {
  clusterGroupings,
  namespaceGroupings,
  sizeByConfigs
} from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/constants';
import HighlightSwitch from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/HighlightSwitch';
import MapListToggle from 'in-kubernetes/Dashboards/commonComponents/commonTabs/MapListToggle';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import SidebarContainer from 'in-components/layout/SidebarContainer';
import { compareIgnoreCase } from 'in-services/util/string';
import useUrlState from 'in-hooks/useUrlState';
import ComboBox from 'in-components/ComboBox';
import { Trans, t } from 'in-i18n';

import locals from './ControlFrame.mless';

export default function ControlFrame(props) {
  const { groupingOptions, view, setView, render } = props;

  const urlStateDefinition = getUrlStateDefinition(props);

  const [urlState, setUrlState] = useUrlState({ bind: urlStateDefinition, replaceHistory: false });
  const { showHealth, grouping, sizeMetricConfig } = urlState;

  return (
    <div>
      <div className={locals.header}>
        <MapListToggle view={view} setView={setView} />
        <div className={locals.right}>
          <Trans
            i18nKey="in-kubernetes:dashboards.groupBy"
            components={{
              labelSpan: <span className={locals.label}>Group by</span>,
              sizeBy: (
                <ComboBox
                  className={locals.input}
                  id="size-by"
                  value={grouping.value}
                  options={groupingOptions}
                  onChange={_grouping => setUrlState({ grouping: _grouping })}
                  isClearable={false}
                  aria-label={t('in-kubernetes:dashboards.groupByLabel')}
                  openMenuOnFocus
                  isSearchable={false}
                />
              )
            }}
          />
          <HighlightSwitch showHealth={showHealth} setShowHealth={_b => setUrlState({ showHealth: _b })} />
        </div>
      </div>

      <SidebarContainer
        sidebar={
          <CarbonRadioButtonGroup
            className={locals.radiogroup}
            legendText={t('in-kubernetes:dashboards.chooseMetric')}
            name="size-by-configs"
            onChange={size => setUrlState({ sizeMetricConfig: sizeByConfigs.find(item => item.value === size) })}
            orientation="vertical"
            valueSelected={sizeByConfigs.find(item => item.value === sizeMetricConfig.value)?.value}
          >
            {sizeByConfigs.map(({ id, label, value }) => (
              <CarbonRadioButton key={id} id={id} value={value} labelText={label} />
            ))}
          </CarbonRadioButtonGroup>
        }
      >
        {render({ ...props, ...urlState })}
      </SidebarContainer>
    </div>
  );
}
const getUrlStateDefinition = ({ initialGrouping }) => {
  const grouping = initialGrouping && getGroupingByValue(initialGrouping);

  const initialState = {
    showHealth: false,
    grouping: grouping || namespaceGroupings[1],
    sizeMetricConfig: sizeByConfigs[sizeByConfigs.length - 1]
  };

  function getGroupingByValue(value) {
    for (let i = 0; i < clusterGroupings.length; i++) {
      if (compareIgnoreCase(clusterGroupings[i].value, value) === 0) {
        return clusterGroupings[i];
      }
    }
  }

  const urlStateDefinition = [
    {
      name: 'podsMap.showHealth',
      path: '/pods',
      initialState: initialState.showHealth,
      parser: v => v === 'true',
      serializer: String,
      as: 'showHealth'
    },
    {
      name: 'podsMap.grouping',
      path: '/pods',
      initialState: initialState.grouping,
      parser: val => clusterGroupings.find(({ value }) => val === value),
      serializer: val => buildJsonParser()(val.value),
      as: 'grouping'
    },
    {
      name: 'podsMap.metricType',
      path: '/pods',
      parser: buildJsonParser(),
      serializer: buildJsonSerializer(),
      as: 'metricType'
    },
    {
      name: 'podsMap.sizeMetricConfig',
      path: '/pods',
      parser: val => sizeByConfigs.find(({ value }) => val === value),
      serializer: val => buildJsonParser()(val.value),
      initialState: initialState.sizeMetricConfig,
      as: 'sizeMetricConfig'
    }
  ];

  return urlStateDefinition;
};

import React, { useCallback, useMemo } from 'react';

import {
  tagFilterExpressionMatrixParameter,
  resetMetricsAndOrderOnTypeChange,
  metricsMatrixParameter,
  chartsMatrixParameter,
  groupMatrixParameter,
  orderMatrixParameter,
  typeMatrixParameter
} from 'in-infrastructure/navigation/paths';
import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { getMetrics, fromUrlMetrics } from 'in-infrastructure/Explore/services/metrics';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { warning, error } from 'in-new-components/Message/types';
import Sections from 'in-new-components/workspace/Sections';
import { pendingResult } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title';

import locals from './Explore.mless';

const urlStateDefinition = {
  bind: [
    tagFilterExpressionMatrixParameter,
    groupMatrixParameter,
    chartsMatrixParameter,
    metricsMatrixParameter,
    orderMatrixParameter,
    typeMatrixParameter
  ],
  resets: [resetMetricsAndOrderOnTypeChange]
};

export default function InfraExploreView() {
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => <InfraExploreViewWithFixatedTimeConfig refreshFixatedTimeConfig={refresh} />}
    </FixatedTimeConfigContextModification>
  );
}

function InfraExploreViewWithFixatedTimeConfig() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression, group, metrics: urlMetrics, type: urlType, order }, onChange] = useUrlState(
    urlStateDefinition
  );
  const type = urlType === 'all' ? null : urlType;
  const setMetrics = useCallback(metrics => onChange({ metrics }), [onChange]);
  const setOrder = useCallback(order => onChange({ order }), [onChange]);

  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [tagFilterExpression, timeConfig]) ?? pendingResult;
  const validGroupResult = useObservable(getIsGroupingValidObservable, [group, timeConfig]) ?? pendingResult;
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const backendQueryModel = useMemo(() => isValid && toBackendQueryModel(tagFilterExpression), [
    isValid,
    tagFilterExpression
  ]);

  const availableMetrics = useObservable(getMetricsObservable, [timeConfig, backendQueryModel, type]) || [];
  const metrics = fromUrlMetrics({ urlMetrics, availableMetrics });

  const onTagFilterExpressionChange = useCallback(tagFilterExpression => onChange({ tagFilterExpression }), [onChange]);
  const onGroupChange = useCallback(group => onChange({ group }), [onChange]);

  return (
    <InfraPageHeaderWithTabs showSearchBar={false} theme={themes.light} addShadow addFooter>
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Explore'
        }}
      />

      <Title title="Explore" />
      <LeftRightPadding className={locals.stack}>
        <Stack>
          <Message type={warning} withIcon small>
            This is a beta version of a new product capability. We advise you not to rely on the data presented.
          </Message>

          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={onTagFilterExpressionChange}
              QueryBuilder={QueryBuilder}
            />

            <GroupingConfiguratorSection
              value={group}
              onChange={onGroupChange}
              GroupingConfigurator={GroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
            />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {isValid && !group?.groupbyTag && (
            <InfrastructureList
              backendQueryModel={backendQueryModel}
              availableMetrics={availableMetrics}
              timeConfig={timeConfig}
              setMetrics={setMetrics}
              setOrder={setOrder}
              metrics={metrics}
              type={type}
              order={order}
              showHeader
            />
          )}

          {isValid && group?.groupbyTag && (
            <GroupedInfrastructure
              tagFilterExpression={tagFilterExpression}
              backendQueryModel={backendQueryModel}
              availableMetrics={availableMetrics}
              timeConfig={timeConfig}
              setMetrics={setMetrics}
              setOrder={setOrder}
              metrics={metrics}
              type={type}
              group={group}
              order={order}
            />
          )}
        </Stack>
      </LeftRightPadding>
    </InfraPageHeaderWithTabs>
  );
}

function getIsQueryValidObservable([tagFilterExpression, timeConfig]) {
  return isQueryValid(tagFilterExpression, timeConfig);
}

function getIsGroupingValidObservable([group, timeConfig]) {
  return isGroupingConfigurationValid(group, timeConfig);
}

function getMetricsObservable([timeConfig, backendQueryModel, type]) {
  return getMetrics({ timeConfig, tagFilterExpression: backendQueryModel, type });
}

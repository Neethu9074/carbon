import React, { useCallback, useMemo } from 'react';

import {
  tagFilterExpressionMatrixParameter,
  groupMatrixParameter,
  chartsMatrixParameter,
  typeMatrixParameter
} from 'in-infrastructure/navigation/paths';
import GroupingConfigurator, {
  isGroupingConfigurationValid
} from 'in-infrastructure/Explore/components/GroupingConfigurator';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import ChartingConfiguratorSection from 'in-new-components/ChartingConfigurator/ChartingConfiguratorSection';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { warning, error } from 'in-new-components/Message/types';
import Sections from 'in-new-components/workspace/Sections';
import { allRenderers } from 'in-stores/metric/renderer';
import { pendingResult } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title';

import locals from './Explore.mless';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter, groupMatrixParameter, chartsMatrixParameter, typeMatrixParameter]
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
  const [{ tagFilterExpression, group, charts, type }, onChange] = useUrlState(urlStateDefinition);
  const typeOrNull = type !== 'all' ? type : null;

  const validTagFilterExpressionResult =
    useObservable(isQueryValid(tagFilterExpression, timeConfig), [tagFilterExpression, timeConfig]) ?? pendingResult;
  const validGroupResult =
    useObservable(isGroupingConfigurationValid(group, timeConfig), [group, timeConfig]) ?? pendingResult;
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const backendQueryModel = useMemo(() => isValid && toBackendQueryModel(tagFilterExpression), [
    isValid,
    tagFilterExpression
  ]);

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
            This is a work in progress. The final version of Infra Explore might look nothing like this.
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

            <ChartingConfiguratorSection
              value={charts[0]}
              onChange={chart =>
                onChange({
                  charts: chart ? [chart] : []
                })
              }
              options={[
                {
                  metricId: 'latency',
                  label: 'Latency',
                  formatter: 'millis.compact',
                  aggregations: [
                    {
                      id: 'MIN',
                      label: 'MIN',
                      renderers: allRenderers
                    },
                    {
                      id: 'MEAN',
                      label: 'MEAN',
                      renderers: allRenderers
                    },
                    {
                      id: 'MAX',
                      label: 'MAX',
                      renderers: allRenderers
                    }
                  ]
                },
                {
                  metricId: 'count',
                  label: 'Count',
                  formatter: 'number.compact',
                  aggregations: [
                    {
                      id: 'SUM',
                      label: 'SUM',
                      renderers: allRenderers
                    }
                  ]
                }
              ]}
            />

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {isValid && !group?.groupbyTag && (
            <InfrastructureList
              backendQueryModel={backendQueryModel}
              timeConfig={timeConfig}
              type={typeOrNull}
              showTotals
            />
          )}

          {isValid && group?.groupbyTag && (
            <GroupedInfrastructure
              onChange={onChange}
              tagFilterExpression={tagFilterExpression}
              backendQueryModel={backendQueryModel}
              group={group}
              timeConfig={timeConfig}
              type={typeOrNull}
            />
          )}
        </Stack>
      </LeftRightPadding>
    </InfraPageHeaderWithTabs>
  );
}

import { just } from 'reactive-observables';
import React, { useMemo } from 'react';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import { ActionSection, Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import { tagFilterExpressionMatrixParameter } from 'in-infrastructure/navigation/paths';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { valueWithFormatterToReadableString } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { warning, error } from 'in-new-components/Message/types';
import Sections from 'in-new-components/workspace/Sections';
import { pendingResult } from 'in-services/fixedObjects';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import MetricValue from 'in-components/MetricValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';

import locals from './Explore.mless';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter]
};

export default function InfraExploreView() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression }, onChange] = useUrlState(urlStateDefinition);
  const validResult = useObservable(isQueryValid(tagFilterExpression), [tagFilterExpression]) ?? pendingResult;
  const backendQueryModel = validResult?.data && toBackendQueryModel(tagFilterExpression);
  const onTagFilterExpressionChange = useMemo(() => {
    return tagFilterExpression => onChange({ tagFilterExpression });
  }, [onChange]);

  return (
    <InfraPageHeaderWithTabs showSearchBar={false} theme={themes.light} addShadow addFooter>
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Explore'
        }}
      />

      <Title title="Explore" />
      <LeftRightPadding>
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

            <ActionSection
              left={
                <>
                  <Action icon="lib_help_error_help_outline">Add grouping</Action>
                  <Action icon="lib_bar_chart">Add chart</Action>
                </>
              }
              right={<ApiQueryAction backendQueryModel={backendQueryModel} />}
            />
          </Sections>

          {validResult.data === false && (
            <Message type={error} withIcon small>
              The filter expression is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {validResult.data === true && (
            <Card>
              <ServerTableWithUrlState
                columnDefinitions={getColumnDefinitions}
                get={getTableData}
                timeConfig={timeConfig}
                backendQueryModel={backendQueryModel}
                fixedLayout
              />
            </Card>
          )}
        </Stack>
      </LeftRightPadding>
    </InfraPageHeaderWithTabs>
  );
}

function getTableData({ timeConfig, page, pageSize, backendQueryModel, orderBy, orderDirection }) {
  return getEntities({
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    pagination: {
      page,
      pageSize
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <EntityLink
          className={locals.link}
          label={item.label}
          plugin={item.plugin}
          href$={getDashboardLink(item.snapshotId)}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  isSearchable: false,
  pathSegment: infraExplorePath,
  matrixPrefix: 'table.'
});

function getColumnDefinitions({ timeConfig, backendQueryModel, result }) {
  if (result.data) {
    const plugins = new Set(result.data.items.map(i => i.plugin));
    if (plugins.size === 1) {
      const plugin = plugins.values().next().value;
      const kpiDefinitions = getKpiDefinitions(plugin);
      const defaultColumns = columnDefinitions.concat(
        kpiDefinitions.map(({ label, metric, formatter }) => ({
          id: metric,
          label,
          sortable: false,
          width: '10rem',
          widthInAbsoluteUnit: true,
          optional: true,
          getContent(item) {
            return <MetricValue snapshotId={item.snapshotId} metric={metric} formatter={formatter} />;
          }
        }))
      );
      const defaultColumnIds = defaultColumns.map(def => def.id);
      return getAvailableMetrics({
        filter: {
          timeConfig,
          tagFilterExpression: backendQueryModel
        },
        plugin
      })
        .map(availableMetrics => {
          if (availableMetrics.data) {
            return defaultColumns.concat(
              availableMetrics.data.metrics
                .filter(({ id }) => !defaultColumnIds.includes(id))
                .map(({ id, label, format }) => {
                  const formatter = v => valueWithFormatterToReadableString(v, format);
                  return {
                    id,
                    label,
                    renderLabel,
                    sortable: false,
                    width: '15rem',
                    widthInAbsoluteUnit: true,
                    optional: true,
                    defaultDisabled: true,
                    getContent(item) {
                      return <MetricValue snapshotId={item.snapshotId} metric={id} formatter={formatter} />;
                    }
                  };
                })
            );
          } else {
            return defaultColumns;
          }
        })
        .startWith(defaultColumns);
    }
  }
  return just(columnDefinitions);
}

function renderLabel({ label }) {
  const content = <span className={locals.metricLabel}>{label}</span>;
  // take a guess that the content will be truncated, although this is a bit hacky because
  // the truncation happens in CSS
  return label.length > 30 ? (
    <Tooltip content={label} align="bottomMiddle">
      {content}
    </Tooltip>
  ) : (
    content
  );
}

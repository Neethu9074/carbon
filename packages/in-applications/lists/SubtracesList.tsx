/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, Link } from '@instana/components';
import { t } from '@instana/i18n-react';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
// @ts-expect-error needs ts migration
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import CreateSubtraceDialog from 'in-applications/creation/Dialog/CreateSubtraceDialog';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { useLinkToSubtraceDashboard } from 'in-applications/navigation/paths';
import { latency, number, percentage } from 'in-services/formatters/number';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { useSubtraces } from 'in-applications/hooks/useSubtraces';
import { subtracesList } from 'in-applications/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import { formatMetricIfPresent } from 'in-applications/metrics';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { TagFilterExpressionElementUnion } from 'in-types';
import { SubtraceListItem } from 'in-applications/types';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';

const pathSegment = subtracesList;
const matrixPrefix = '';

// TODO: take this from @instana/types once BE is exposing it.
export interface Subtrace {
  id: string;
  name: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
  evaluationGranularitySeconds: number;
  count: number;
  meanDuration: number;
  meanSubcallCount: number;
  meanErrorRate: number;
}

const SubtraceLink = ({ item }: { item: SubtraceListItem }) => {
  const getLinkToSubtraceDashboard = useLinkToSubtraceDashboard();
  return <Link href={getLinkToSubtraceDashboard({ subtraceId: item.subtraceConfigId })}>{item.subtraceName}</Link>;
};

const columnDefinitions: ColumnDefinition<SubtraceListItem>[] = [
  {
    id: 'subtraceName',
    label: t('in-applications:subtraces.subtracesList.name'),
    getContent: item => <SubtraceLink item={item} />,
    sortable: true
  },
  {
    id: 'subtraceCount',
    label: t('in-applications:subtraces.subtracesList.count'),
    getContent: item => <MetricValue value={number.compact(item.subtraceCount ?? 0)} />,
    sortable: false
  },
  {
    id: 'duration',
    label: t('in-applications:subtraces.meanDuration'),
    getContent: item => <MetricValue value={formatMetricIfPresent(item.duration, latency.detailed)} />,
    sortable: false
  },
  {
    id: 'calls',
    label: t('in-applications:subtraces.subtracesList.meanSubcallCount'),
    getContent: item => <MetricValue value={number.compact(item.calls ?? 0)} />,
    sortable: false
  },
  {
    id: 'errorRate',
    label: t('in-applications:subtraces.subtracesList.meanErrorRate'),
    getContent: item => <MetricValue value={formatMetricIfPresent(item.errorRate, percentage.detailed)} />,
    sortable: false
  }
];

const CreateSubtraceButton = () => (
  <Button kind="action" onClick={() => addActiveDialog(<CreateSubtraceDialog />)} icon="lib_openclose_add_box">
    {t('in-applications:subtraces.newSubtrace')}
  </Button>
);

export default function SubtracesList() {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'subtraceName',
    defaultPageSize: 10
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const subtracesResult = useSubtraces({
    order: { by: orderBy, direction: orderDirection },
    pagination: { page, pageSize },
    query
  });

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-applications:subtraces.labelSubtraces')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.applications,
            pageRootName: pageNames.subtraces
          }}
        />
        <ServerTablePresenter<SubtraceListItem, ServerTablePresenterProps<SubtraceListItem>>
          onChange={setServerTableUrlState}
          pageSize={pageSize}
          page={page}
          cardTitle={t('in-applications:subtraces.labelSubtraces')}
          orderBy={orderBy}
          orderDirection={orderDirection}
          query={query}
          result={subtracesResult}
          columnDefinitions={columnDefinitions}
          rightHeader={role?.canConfigureSubtraces ? CreateSubtraceButton : undefined}
        />
      </LeftRightPadding>
    </Sticky>
  );
}

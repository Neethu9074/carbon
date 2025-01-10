/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TableEntityCounter } from '@instana/legacy';
import { Button, Link } from '@instana/components';
import { t } from '@instana/i18n-react';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
// @ts-expect-error needs ts migration
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import CreateSubtraceDialog from 'in-applications/creation/Dialog/CreateSubtraceDialog';
import { useLinkToSubtraceDashboard } from 'in-applications/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { useSubtraces } from 'in-applications/hooks/useSubtraces';
import { subtracesList } from 'in-applications/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { TagFilterExpressionElementUnion } from 'in-types';
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

const SubtraceLink = ({ item }: { item: Subtrace }) => {
  const getLinkToSubtraceDashboard = useLinkToSubtraceDashboard();
  return <Link href={getLinkToSubtraceDashboard({ subtraceId: item.id })}>{item.name}</Link>;
};

const columnDefinitions: ColumnDefinition<Subtrace>[] = [
  {
    id: 'name',
    label: t('in-applications:subtraces.subtracesList.name'),
    getContent: item => <SubtraceLink item={item} />,
    sortable: true
  },
  {
    id: 'count',
    label: t('in-applications:subtraces.subtracesList.count'),
    getContent: item => <TableEntityCounter count={item.count} icon="regular" />,
    sortable: false
  },
  {
    id: 'meanDuration',
    label: t('in-applications:subtraces.subtracesList.meanDuration'),
    getContent: item => <TableEntityCounter count={item.meanDuration} icon="regular" />,
    sortable: false
  },
  {
    id: 'meanSubcallCount',
    label: t('in-applications:subtraces.subtracesList.meanSubcallCount'),
    getContent: item => <TableEntityCounter count={item.meanSubcallCount} icon="regular" />,
    sortable: false
  },
  {
    id: 'meanErrorRate',
    label: t('in-applications:subtraces.subtracesList.meanErrorRate'),
    getContent: item => <TableEntityCounter count={item.meanErrorRate} icon="regular" />,
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
    defaultOrderBy: 'name',
    defaultPageSize: 10
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const subtracesResult = useSubtraces(page, pageSize);

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
        <ServerTablePresenter<Subtrace, ServerTablePresenterProps<Subtrace>>
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

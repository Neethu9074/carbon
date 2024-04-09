/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, Pill, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { UserResult } from '@instana/types';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import { getCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import useGetCustomDashboardPermissions from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboardPermissions';
//@ts-expect-error doesn't contain type file
import NewDashboardDialog from 'in-custom-dashboards/NewDashboardDialog';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { getCustomDashboards, getUsers } from 'in-custom-dashboards/api';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { welcomePageV2Enabled } from 'in-services/featureFlags';
import { timeConfig$ } from 'in-stores/time/config';

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function DashboardWidget({
  config,
  widgetLabel,
  dashboardTileProps,
  maxItems,
  viewAll = welcomePageV2Enabled
}: WidgetProps) {
  // @ts-ignore
  const users = useObservable(getUsers, []) ?? null;
  const { createHrefToPath } = useNavigation();

  const getHeaders = () => {
    return [
      {
        header: t('in-plg:welcomepage.component.dashboardWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.dashboardWidget.owner'),
        key: 'owner'
      },
      {
        header: t('in-plg:welcomepage.component.dashboardWidget.permissions'),
        key: 'permissions'
      }
    ];
  };

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        return <Link href={getCustomDashboardLink(item.id)}>{item.title}</Link>;
      }
    },
    {
      key: 'owner',
      getContent({ item }) {
        const user = users?.data?.find((user: UserResult) => user.id === item.ownerId);

        if (!user) {
          return '-';
        }

        return <Typography variant="body-regular">{user.fullName}</Typography>;
      }
    },
    {
      key: 'permissions',
      getContent({ item }) {
        return <DashboardPermission id={item.id} />;
      }
    }
  ];

  const generalProps = {
    ...config,
    headers: getHeaders(),
    columnDefinitions,
    timeConfig: null
  };

  function addNewDashboard() {
    addActiveDialog(<NewDashboardDialog />);
  }

  return (
    <DatatableWrapper
      {...generalProps}
      query=""
      hasAddMore
      isDashboardWidget
      maxItems={maxItems}
      viewAll={viewAll}
      href={createHrefToPath(customDashboardsPath)}
      getItems={getCustomDashboards}
      addMore={addNewDashboard}
      addData={addNewDashboard}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});

function DashboardPermission({ id }: { id: string }) {
  const permission: string = useGetCustomDashboardPermissions(id);

  return (
    <Pill kind="info" type="gray">
      {permission}
    </Pill>
  );
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import { getCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import useGetCustomDashboardPermissions from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboardPermissions';
//@ts-expect-error doesn't contain type file
import NewDashboardDialog from 'in-custom-dashboards/NewDashboardDialog';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import useGetCustomDashboard from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboard';
import useGetUserDetail from 'in-plg/pages/WelcomePage/widgets/hooks/useGetUserDetail';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { searchCustomDashboards } from 'in-custom-dashboards/api';
import { timeConfig$ } from 'in-stores/time/config';

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function DashboardWidget({ config, widgetLabel, dashboardTileProps }: WidgetProps) {
  const getHeaders = () => {
    return [
      {
        header: t('in-plg:welcomepage.component.dashboardWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.dashboardWidget.owner'),
        key: 'owner'
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
        return <CustomDashboardOwner id={item.id} />;
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

  function getDashboards({ query }: { query: string }) {
    return searchCustomDashboards(query);
  }

  return (
    <DatatableWrapper
      {...generalProps}
      getItems={getDashboards}
      query=""
      hasAddMore
      addMore={addNewDashboard}
      addData={addNewDashboard}
      isDashboardWidget
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});

function CustomDashboardOwner({ id }: { id: string }) {
  let userId = null;
  const dashboard = useGetCustomDashboard(id);
  if (dashboard) {
    const accessRules = dashboard.accessRules;
    accessRules.forEach(item => {
      if (item.relationType === 'USER' && item.relatedId) {
        userId = item.relatedId;
      }
    });
  }

  return userId && <OwnerDetail userId={userId} />;
}

function OwnerDetail({ userId }: { userId: string }) {
  const user = useGetUserDetail(userId);
  if (!user) {
    return null;
  }
  return <Typography variant="body-regular">{user.fullName}</Typography>;
}

function DashboardPermission({ id }: { id: string }) {
  const permission: string = useGetCustomDashboardPermissions(id);

  return <Typography variant="body-regular">{permission}</Typography>;
}

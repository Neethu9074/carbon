/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { CustomDashboard, Result, UserResult } from '@instana/types';
import { IconButton, Link, Pill } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import useGetCustomDashboardPermissions from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboardPermissions';
//@ts-expect-error doesn't contain type file
import NewDashboardDialog from 'in-custom-dashboards/NewDashboardDialog';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-cockpit/starredItems';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
import { customDashboard as customDashboardType } from 'in-cockpit/starredItems/types';
import { getCustomDashboardsPaginated, getUsers } from 'in-custom-dashboards/api';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { welcomePageV2Enabled } from 'in-services/featureFlags';
import { getCustomDashboard } from 'in-custom-dashboards/api';
import { hasError, isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';

export default function DashboardWidget({
  config,
  widgetLabel,
  dashboardTileProps,
  maxItems,
  viewAll = welcomePageV2Enabled,
  mainPage
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
      },
      {
        key: 'favourite',
        header: ''
      }
    ];
  };

  const { location, createHref } = useNavigation();
  const connectToLocation = { ...location, pathname: viewPathFullyQualified };

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        setOrDeleteMatrixKey(connectToLocation, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, item.id);
        return (
          <Tooltip content={item.title} align="auto" caret={false} delay={300}>
            <Link href={createHref(connectToLocation)}>{item.title}</Link>
          </Tooltip>
        );
      }
    },
    {
      key: 'owner',
      getContent({ item }) {
        const user = users?.data?.find((user: UserResult) => user.id === item.ownerId);

        if (!user) {
          return '-';
        }

        return <TypographyWithTooltip content={user.fullName} />;
      }
    },
    {
      key: 'permissions',
      getContent({ item }) {
        return <DashboardPermission id={item.id} annotations={item.annotations} />;
      }
    },
    {
      key: 'favourite',
      getContent({ id, item, isDisabled = false, isFavourite = false }) {
        return (
          <IconButton
            aria-label={
              isFavourite
                ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                : item?.pinned
                ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                : t('in-plg:welcomepage.favouriteButton.aria')
            }
            type={
              isFavourite
                ? 'lib_actions_favorite_filled'
                : item?.pinned
                ? 'lib_actions_favorite_filled'
                : 'lib_actions_favorite'
            }
            onClick={() => handleFavoriteClick(id, item, isFavourite)}
            iconSize="xs"
            disabled={isDisabled}
          />
        );
      }
    }
  ];

  function handleFavoriteClick(id: string, item: CustomDashboard, isFavourite: boolean) {
    if (!id && !item) return;
    if (isFavourite) {
      remove({ id: id, type: customDashboardType });
    } else {
      add({
        id: item?.id,
        label: item?.title,
        type: customDashboardType
      });
    }
  }

  function getItem(id: string) {
    return getCustomDashboard(id).map((dashboardResult: Result<CustomDashboard>) => {
      if (isLoading(dashboardResult) || hasError(dashboardResult)) {
        return just(dashboardResult);
      } else {
        return dashboardResult;
      }
    });
  }

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
      pinnedItemTypes={[customDashboardType]}
      tableType="dashboardWidget"
      hasAddPermission
      hasAddMore
      isDashboardWidget
      maxItems={maxItems}
      viewAll={viewAll}
      href={createHrefToPath(customDashboardsPath)}
      getItems={getCustomDashboardsPaginated}
      addMore={addNewDashboard}
      addData={addNewDashboard}
      getItem={getItem}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.dashboardWidget.searchPlaceholderLabel')}
      addButtonLabel={t('in-plg:welcomepage.component.dashboardWidget.addButtonLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.dashboardWidget.viewAllLabel')}
      mainPage={mainPage}
    />
  );
}

function DashboardPermission({ id, annotations }: { id: string; annotations: Array<string> }) {
  const [dashboardPermission, setDashboardPermission] = useState('');
  const permissionResult: string | null = useGetCustomDashboardPermissions(id, annotations);
  useEffect(() => {
    if (permissionResult) {
      setDashboardPermission(permissionResult);
    } else {
      setDashboardPermission('');
    }
  }, [permissionResult]);
  return dashboardPermission ? <Pill type="gray">{dashboardPermission}</Pill> : null;
}

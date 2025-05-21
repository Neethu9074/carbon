/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { CustomDashboard, Result, UserResult } from '@instana/types';
import { IconButton, Link, Pill } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-plg/pages/WelcomePage/widgets/starredItems';
import useGetCustomDashboardPermissions from 'in-plg/pages/WelcomePage/widgets/hooks/useGetCustomDashboardPermissions';
//@ts-expect-error doesn't contain type file
import NewDashboardDialog from 'in-custom-dashboards/NewDashboardDialog';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { customDashboard as customDashboardType } from 'in-plg/pages/WelcomePage/widgets/starredItems/types';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
import { getCustomDashboardsPaginated, getUsers } from 'in-custom-dashboards/api';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import TagsInTable from 'in-settings/tabs/GlobalSettings/components/TagsInTable';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getCustomDashboard } from 'in-custom-dashboards/api';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import Tooltip from 'in-components/Tooltip/Tooltip';

export default function DashboardWidget({
  config,
  widgetLabel,
  dashboardTileProps,
  maxItems,
  viewAll = true,
  mainPage
}: WidgetProps) {
  // @ts-ignore
  const users = useObservable(getUsers, []) ?? null;
  const { createHrefToPath } = useNavigation();
  const [currentFavoriteDashboardIds, setCurrentFavoriteDashboardIds] = useState<string[]>([]);
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
      ...(rbacTeamsEnabled
        ? [
            {
              header: t('in-plg:welcomepage.component.dashboardWidget.teams'),
              key: 'teams'
            }
          ]
        : []),
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
          <Tooltip content={item?.title ?? ''} align="auto" caret={false} delay={300}>
            <Link href={createHref(connectToLocation)}>{item?.title ?? ''}</Link>
          </Tooltip>
        );
      }
    },
    {
      key: 'owner',
      getContent({ item }) {
        const user = users?.data?.find((user: UserResult) => user.id === item?.ownerId);

        if (!user) {
          return '-';
        }

        return <TypographyWithTooltip content={user?.fullName ?? ''} />;
      }
    },
    {
      key: 'permissions',
      getContent({ item }) {
        return <DashboardPermission id={item?.id} annotations={item?.annotations} />;
      }
    },
    ...(rbacTeamsEnabled
      ? [
          {
            key: 'teams',
            getContent({ item }: any) {
              const tags = item?.rbacTags;
              return <TagsInTable tags={tags} />;
            }
          }
        ]
      : []),
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
            onClick={() => handleFavoriteClick(id, item, isFavourite, setCurrentFavoriteDashboardIds)}
            iconSize="xs"
            disabled={isDisabled}
          />
        );
      }
    }
  ];

  function handleFavoriteClick(
    id: string,
    item: CustomDashboard,
    isFavourite: boolean,
    setCurrentFavoriteDashboardIds: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    if (!id && !item) return;
    if (isFavourite) {
      remove({ id: id, type: customDashboardType });
      setCurrentFavoriteDashboardIds(prevIds => prevIds.filter(favId => favId !== id));
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
      const dashboardId = dashboardResult?.data?.id;
      if (dashboardId && !currentFavoriteDashboardIds.includes(dashboardId)) {
        setCurrentFavoriteDashboardIds(prevList => [...prevList, dashboardId]);
      }
      return dashboardResult;
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
      nonDeletedFavoriteCount={currentFavoriteDashboardIds.length}
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

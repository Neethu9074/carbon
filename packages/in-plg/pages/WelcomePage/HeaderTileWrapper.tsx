/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';

import { HeaderTile, HeaderTileProps } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

// @ts-expect-error missing a type definition for it
import { getAccountAsResultObservable } from 'in-amp/api/account';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export default function HeaderTileWrapper({ headerTitle, foldableTileTitle, datepicker }: HeaderTileProps) {
  const { createHrefToPath } = useNavigation();
  const [permissions, setPermissions] = useState<string[]>();
  const [statusFlags, setStatusFlags] = useState({
    firstAgentInstalled: true,
    tracingReported: true,
    additionalUserInvited: true,
    threeAgentsInstalled: true,
    twoApplicationPerspectivesCreated: true,
    oneAlertSetUpAndActivated: true,
    oneWebsiteMonitored: true,
    fiveUsers: true
  });

  const accountInfo = useObservable(getAccountAsResultObservable, []);

  useEffect(() => {
    const storedPermissions = window.instana?.user?.role?.permissions;
    setPermissions(storedPermissions);
    extractCurrentStatus(accountInfo);
  }, [accountInfo]);

  // Here, it collects only the headerItemTiles that the user needs to complete for their onboarding task.
  const tileDataWhenActionIsNotCompleted = useMemo(() => {
    function hasPermission(key: string) {
      if (!permissions) {
        return false;
      }
      switch (key) {
        case 'startIntegrating':
          return permissions.includes('CAN_CONFIGURE_AGENTS');
        case 'traceInteractions':
          return permissions.includes('CAN_CONFIGURE_AGENTS');
        case 'inviteUsers':
          return permissions.includes('CAN_CONFIGURE_USERS');
        case 'additionalAgents':
          return permissions.includes('CAN_CONFIGURE_AGENTS');
        case 'appPerspective':
          return permissions.includes('CAN_CONFIGURE_APPLICATIONS');
        case 'smartAlerts':
          return permissions.includes('CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS');
        case 'startMonitoring':
          return permissions.includes('CAN_CONFIGURE_MOBILE_APP_MONITORING');
        case 'inviteTeammates':
          return permissions.includes('CAN_CONFIGURE_USERS');
        default:
          return false;
      }
    }

    const tileData = [
      {
        key: 'startIntegrating',
        title: t('in-plg:welcomepage.startIntegrating.title'),
        description: t('in-plg:welcomepage.startIntegrating.description'),
        buttonName: t('in-plg:welcomepage.startIntegrating.buttonName'),
        buttonType: 'primary',
        href: createRedirectHref('startIntegrating'),
        hasPermission: hasPermission('startIntegrating'),
        isActionCompleted: statusFlags.firstAgentInstalled
      },
      {
        key: 'traceInteractions',
        title: t('in-plg:welcomepage.traceInteractions.title'),
        description: t('in-plg:welcomepage.traceInteractions.description'),
        buttonName: t('in-plg:welcomepage.traceInteractions.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('traceInteractions'),
        hasPermission: permissions?.includes('CAN_CONFIGURE_AGENTS'),
        isActionCompleted: statusFlags.tracingReported
      },
      {
        key: 'inviteUsers',
        title: t('in-plg:welcomepage.inviteUsers.title'),
        description: t('in-plg:welcomepage.inviteUsers.description'),
        buttonName: t('in-plg:welcomepage.inviteUsers.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteUsers'),
        hasPermission: hasPermission('inviteUsers'),
        isActionCompleted: statusFlags.additionalUserInvited
      },
      {
        key: 'additionalAgents',
        title: t('in-plg:welcomepage.additionalAgents.title'),
        description: t('in-plg:welcomepage.additionalAgents.description'),
        buttonName: t('in-plg:welcomepage.additionalAgents.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteUsers'),
        hasPermission: hasPermission('additionalAgents'),
        isActionCompleted: statusFlags.threeAgentsInstalled
      },
      {
        key: 'appPerspective',
        title: t('in-plg:welcomepage.appPerspective.title'),
        description: t('in-plg:welcomepage.appPerspective.description'),
        buttonName: t('in-plg:welcomepage.appPerspective.buttonName'),
        buttonType: 'ghost',
        hasPermission: hasPermission('appPerspective'),
        isActionCompleted: statusFlags.twoApplicationPerspectivesCreated
      },
      {
        key: 'smartAlerts',
        title: t('in-plg:welcomepage.smartAlerts.title'),
        description: t('in-plg:welcomepage.smartAlerts.description'),
        buttonName: t('in-plg:welcomepage.smartAlerts.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('smartAlerts'),
        hasPermission: hasPermission('smartAlerts'),
        isActionCompleted: statusFlags.oneAlertSetUpAndActivated
      },
      {
        key: 'startMonitoring',
        title: t('in-plg:welcomepage.startMonitoring.title'),
        description: t('in-plg:welcomepage.startMonitoring.description'),
        buttonName: t('in-plg:welcomepage.startMonitoring.buttonName'),
        buttonType: 'ghost',
        hasPermission: hasPermission('startMonitoring'),
        isActionCompleted: statusFlags.oneWebsiteMonitored
      },
      {
        key: 'inviteTeammates',
        title: t('in-plg:welcomepage.inviteTeammates.title'),
        description: t('in-plg:welcomepage.inviteTeammates.description'),
        buttonName: t('in-plg:welcomepage.inviteTeammates.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteTeammates'),
        hasPermission: hasPermission('inviteTeammates'),
        isActionCompleted: statusFlags.fiveUsers
      }
    ];
    function createRedirectHref(currentTile: string) {
      if (currentTile == 'startIntegrating' || currentTile == 'additionalAgents') {
        return createHrefToPath('/agents/installation');
      } else if (currentTile == 'traceInteractions') {
        return 'https://www.ibm.com/docs/en/instana-observability/current?topic=references-tracing-in-instana';
      } else if (currentTile == 'inviteUsers' || currentTile == 'inviteTeammates') {
        return createHrefToPath('/config/team/accessControl/users');
      } else if (currentTile == 'appPerspective') {
        return createHrefToPath('/applications');
      } else if (currentTile == 'smartAlerts') {
        return createHrefToPath('/alerts;configsCategory=global');
      } else if (currentTile == 'startMonitoring') {
        return createHrefToPath('/websiteMonitoring/websites');
      } else {
        return createHrefToPath('/config/team/accessControl/users');
      }
    }
    return tileData.filter(item => !item.isActionCompleted);
  }, [
    createHrefToPath,
    statusFlags.additionalUserInvited,
    statusFlags.tracingReported,
    statusFlags.firstAgentInstalled,
    statusFlags.fiveUsers,
    statusFlags.oneAlertSetUpAndActivated,
    statusFlags.oneWebsiteMonitored,
    statusFlags.threeAgentsInstalled,
    statusFlags.twoApplicationPerspectivesCreated,
    permissions
  ]);

  function extractCurrentStatus(accountInfo: any) {
    const activation = accountInfo?.data?.activation;
    if (!activation || Object.keys(activation).length === 0) {
      return;
    }
    const keys = Object.keys(activation);
    setStatusFlags({
      // There are different arguments used for the collection of status, these arguments are defined in the API by the portal team. i.e, fa, tr, au, ai, ap, as, w, u - These are the arguments.
      firstAgentInstalled: activation[keys[0]].fa.status,
      tracingReported: activation[keys[0]].tr.status,
      additionalUserInvited: activation[keys[0]].au.status,
      threeAgentsInstalled: activation[keys[0]].ai.status,
      twoApplicationPerspectivesCreated: activation[keys[0]].ap.status,
      oneAlertSetUpAndActivated: activation[keys[0]].as.status,
      oneWebsiteMonitored: activation[keys[0]].w.status,
      fiveUsers: activation[keys[0]].u.status
    });
  }

  return (
    <HeaderTile
      tileData={tileDataWhenActionIsNotCompleted}
      headerTitle={headerTitle}
      foldableTileTitle={foldableTileTitle}
      datepicker={datepicker}
    />
  );
}

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
import { role } from 'in-stores/user';

export default function HeaderTileWrapper({ headerTitle, foldableTileTitle, datepicker }: HeaderTileProps) {
  const { createHrefToPath } = useNavigation();
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
    extractCurrentStatus(accountInfo);
  }, [accountInfo]);

  // Here, it collects only the headerItemTiles that the user needs to complete for their onboarding task.
  const tileDataWhenActionIsNotCompleted = useMemo(() => {
    const tileData = [
      {
        key: 'startIntegrating',
        title: t('in-plg:welcomepage.startIntegrating.title'),
        description: t('in-plg:welcomepage.startIntegrating.description'),
        buttonName: t('in-plg:welcomepage.startIntegrating.buttonName'),
        buttonType: 'primary',
        href: createRedirectHref('startIntegrating'),
        hasPermission: role?.canConfigureAgents,
        isActionCompleted: statusFlags.firstAgentInstalled
      },
      {
        key: 'traceInteractions',
        title: t('in-plg:welcomepage.traceInteractions.title'),
        description: t('in-plg:welcomepage.traceInteractions.description'),
        buttonName: t('in-plg:welcomepage.traceInteractions.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('traceInteractions'),
        hasPermission: role?.canConfigureAgents,
        isActionCompleted: statusFlags.tracingReported
      },
      {
        key: 'inviteUsers',
        title: t('in-plg:welcomepage.inviteUsers.title'),
        description: t('in-plg:welcomepage.inviteUsers.description'),
        buttonName: t('in-plg:welcomepage.inviteUsers.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteUsers'),
        hasPermission: role?.canConfigureUsers,
        isActionCompleted: statusFlags.additionalUserInvited
      },
      {
        key: 'additionalAgents',
        title: t('in-plg:welcomepage.additionalAgents.title'),
        description: t('in-plg:welcomepage.additionalAgents.description'),
        buttonName: t('in-plg:welcomepage.additionalAgents.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteUsers'),
        hasPermission: role?.canConfigureAgents,
        isActionCompleted: statusFlags.threeAgentsInstalled
      },
      {
        key: 'appPerspective',
        title: t('in-plg:welcomepage.appPerspective.title'),
        description: t('in-plg:welcomepage.appPerspective.description'),
        buttonName: t('in-plg:welcomepage.appPerspective.buttonName'),
        buttonType: 'ghost',
        hasPermission: role?.canConfigureApplications,
        isActionCompleted: statusFlags.twoApplicationPerspectivesCreated
      },
      {
        key: 'smartAlerts',
        title: t('in-plg:welcomepage.smartAlerts.title'),
        description: t('in-plg:welcomepage.smartAlerts.description'),
        buttonName: t('in-plg:welcomepage.smartAlerts.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('smartAlerts'),
        hasPermission: role?.canConfigureGlobalApplicationSmartAlerts,
        isActionCompleted: statusFlags.oneAlertSetUpAndActivated
      },
      {
        key: 'startMonitoring',
        title: t('in-plg:welcomepage.startMonitoring.title'),
        description: t('in-plg:welcomepage.startMonitoring.description'),
        buttonName: t('in-plg:welcomepage.startMonitoring.buttonName'),
        buttonType: 'ghost',
        hasPermission: role?.canConfigureMobileAppMonitoring,
        isActionCompleted: statusFlags.oneWebsiteMonitored
      },
      {
        key: 'inviteTeammates',
        title: t('in-plg:welcomepage.inviteTeammates.title'),
        description: t('in-plg:welcomepage.inviteTeammates.description'),
        buttonName: t('in-plg:welcomepage.inviteTeammates.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteTeammates'),
        hasPermission: role?.canConfigureUsers,
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
    statusFlags.twoApplicationPerspectivesCreated
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

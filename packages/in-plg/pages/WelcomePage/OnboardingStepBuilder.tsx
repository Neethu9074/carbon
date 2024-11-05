/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { HeaderItemTile, Stack, TileButtonTypes } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  UNIT_ONBOARDING_BRING_IN_MORE_DATA_CLICK,
  UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK,
  UNIT_ONBOARDING_CONNECT_WITH_EXPERTS_CLICK,
  UNIT_ONBOARDING_GET_ALERTED_CLICK,
  UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK,
  UNIT_ONBOARDING_START_INTEGRATING_CLICK,
  UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK,
  UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK
} from 'in-services/tracking/eventNames';
import { securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { CTA_CLICKED } from 'in-services/util/constants';
import { hasWebsitesAccess } from 'in-stores/permission';
import config from 'in-services/config';
import { role } from 'in-stores/user';

interface TileDataType {
  key: string;
  title: string;
  description: string;
  buttonName: string;
  buttonType: string;
  href?: string;
  hasPermission?: boolean;
  isActionCompleted?: boolean;
  onButtonClick: () => void;
}
//we cannot provide correct type for activationData as the json object keys are dynamic
export default function OnboardingStepBuilder({ activation }: { activation: any }) {
  const currentTenantUnit = `${config.tenant}#${config.tenantUnit}`;
  const [onboardingItems, setOnboardingItems] = useState<TileDataType[]>([]);
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

  const { pageRootName, productArea } = getViewTrackingMetaData();

  function getValidButtonType(buttonType?: string): (typeof TileButtonTypes)[number] {
    if (buttonType && TileButtonTypes.includes(buttonType as any)) {
      return buttonType as any;
    } else {
      return 'primary';
    }
  }

  const createRedirectHref = useCallback(
    (currentTile: string) => {
      if (currentTile === 'startIntegrating' || currentTile === 'additionalAgents') {
        return createHrefToPath('/agents/installation');
      } else if (currentTile === 'traceInteractions') {
        return 'https://ibm.biz/instana-tracing';
      } else if (currentTile === 'inviteUsers' || currentTile === 'inviteTeammates') {
        return createHrefToPath(securityAndAccessAccessControlUsers);
      } else if (currentTile === 'appPerspective') {
        return createHrefToPath('/applications');
      } else if (currentTile === 'smartAlerts') {
        return createHrefToPath('/alerts;configsCategory=global');
      } else if (currentTile === 'startMonitoring') {
        return createHrefToPath('/websiteMonitoring/websites');
      } else {
        return createHrefToPath(securityAndAccessAccessControlUsers);
      }
    },
    [createHrefToPath]
  );

  const sendEventsToSegment = useCallback(
    (eventName: string) => {
      if (pageRootName && productArea) {
        const data = {
          parentPageName: pageRootName,
          parentPageCategory: productArea,
          CTA: eventName,
          path: location?.pathname
        };
        eventTracker({ data, segmentEventName: CTA_CLICKED });
      }
    },
    [pageRootName, productArea]
  );

  const tileData: TileDataType[] = useMemo(
    () => [
      {
        key: 'startIntegrating',
        title: t('in-plg:welcomepage.startIntegrating.title'),
        description: t('in-plg:welcomepage.startIntegrating.description'),
        buttonName: t('in-plg:welcomepage.startIntegrating.buttonName'),
        buttonType: 'primary',
        href: createRedirectHref('startIntegrating'),
        hasPermission: role?.canConfigureAgents,
        isActionCompleted: statusFlags.firstAgentInstalled,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_START_INTEGRATING_CLICK);
        }
      },
      {
        key: 'traceInteractions',
        title: t('in-plg:welcomepage.traceInteractions.title'),
        description: t('in-plg:welcomepage.traceInteractions.description'),
        buttonName: t('in-plg:welcomepage.traceInteractions.buttonName'),
        buttonType: 'ghost',
        hasPermission: role?.canConfigureAgents,
        isActionCompleted: statusFlags.tracingReported,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK);
          window.open(createRedirectHref('traceInteractions'), '_blank', 'noreferrer');
        }
      },
      {
        key: 'inviteUsers',
        title: t('in-plg:welcomepage.inviteUsers.title'),
        description: t('in-plg:welcomepage.inviteUsers.description'),
        buttonName: t('in-plg:welcomepage.inviteUsers.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteUsers'),
        hasPermission: role?.canConfigureUsers,
        isActionCompleted: statusFlags.additionalUserInvited,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_CONNECT_WITH_EXPERTS_CLICK);
        }
      },
      {
        key: 'additionalAgents',
        title: t('in-plg:welcomepage.additionalAgents.title'),
        description: t('in-plg:welcomepage.additionalAgents.description'),
        buttonName: t('in-plg:welcomepage.additionalAgents.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('additionalAgents'),
        hasPermission: role?.canConfigureAgents,
        isActionCompleted: statusFlags.threeAgentsInstalled,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_BRING_IN_MORE_DATA_CLICK);
        }
      },
      {
        key: 'appPerspective',
        title: t('in-plg:welcomepage.appPerspective.title'),
        description: t('in-plg:welcomepage.appPerspective.description'),
        buttonName: t('in-plg:welcomepage.appPerspective.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('appPerspective'),
        hasPermission: role?.canConfigureApplications,
        isActionCompleted: statusFlags.twoApplicationPerspectivesCreated,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK);
        }
      },
      {
        key: 'smartAlerts',
        title: t('in-plg:welcomepage.smartAlerts.title'),
        description: t('in-plg:welcomepage.smartAlerts.description'),
        buttonName: t('in-plg:welcomepage.smartAlerts.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('smartAlerts'),
        hasPermission: role?.canConfigureGlobalApplicationSmartAlerts,
        isActionCompleted: statusFlags.oneAlertSetUpAndActivated,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_GET_ALERTED_CLICK);
        }
      },
      {
        key: 'startMonitoring',
        title: t('in-plg:welcomepage.startMonitoring.title'),
        description: t('in-plg:welcomepage.startMonitoring.description'),
        buttonName: t('in-plg:welcomepage.startMonitoring.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('startMonitoring'),
        hasPermission: hasWebsitesAccess,
        isActionCompleted: statusFlags.oneWebsiteMonitored,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK);
        }
      },
      {
        key: 'inviteTeammates',
        title: t('in-plg:welcomepage.inviteTeammates.title'),
        description: t('in-plg:welcomepage.inviteTeammates.description'),
        buttonName: t('in-plg:welcomepage.inviteTeammates.buttonName'),
        buttonType: 'ghost',
        href: createRedirectHref('inviteTeammates'),
        hasPermission: role?.canConfigureUsers,
        isActionCompleted: statusFlags.fiveUsers,
        onButtonClick: () => {
          sendEventsToSegment(UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK);
        }
      }
    ],
    [createRedirectHref, sendEventsToSegment, statusFlags]
  );

  useEffect(() => {
    const itemsNotCompleted = tileData.filter(item => !item.isActionCompleted);
    setOnboardingItems(itemsNotCompleted);
  }, [statusFlags, tileData]);

  useEffect(() => {
    if (!activation || Object.keys(activation).length === 0) {
      return;
    }

    setStatusFlags({
      firstAgentInstalled: activation ? activation[currentTenantUnit]?.fa?.status : true,
      tracingReported: activation ? activation[currentTenantUnit]?.tr?.status : true,
      additionalUserInvited: activation ? activation[currentTenantUnit]?.au?.status : true,
      threeAgentsInstalled: activation ? activation[currentTenantUnit]?.ai?.status : true,
      twoApplicationPerspectivesCreated: activation ? activation[currentTenantUnit]?.ap?.status : true,
      oneAlertSetUpAndActivated: activation ? activation[currentTenantUnit]?.sas?.status : true,
      oneWebsiteMonitored: activation ? activation[currentTenantUnit]?.w?.status : true,
      fiveUsers: activation ? activation[currentTenantUnit]?.u?.status : true
    });
  }, [activation, currentTenantUnit]);

  if (!activation || Object.keys(activation).length === 0) return null;

  return (
    <Stack gap="xxlarge" direction="horizontal" distribution="start">
      {onboardingItems.map((item: TileDataType) => (
        <div key={item.key}>
          <HeaderItemTile
            key={item.key}
            title={item.title}
            description={item.description}
            buttonName={item.buttonName}
            hasPermission={item.hasPermission}
            buttonType={getValidButtonType(item.buttonType)}
            onButtonClick={item.onButtonClick}
            href={item.href}
          />
        </div>
      ))}
    </Stack>
  );
}

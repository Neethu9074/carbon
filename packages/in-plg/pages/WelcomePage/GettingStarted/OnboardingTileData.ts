/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  Data_1,
  Explore,
  NotificationNew,
  ShareKnowledge,
  CloudMonitoring,
  AnalyticsCustom
} from '@carbon/icons-react';

import { t } from '@instana/i18n-react';

import {
  UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK,
  UNIT_ONBOARDING_GET_ALERTED_CLICK,
  UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK,
  UNIT_ONBOARDING_START_INTEGRATING_CLICK,
  UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK,
  UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK
} from 'in-services/tracking/eventNames';
import { securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { datasourceInstanaAgentPath } from 'in-plg/navigation/paths';
import { newOTelPageEnabled } from 'in-services/featureFlags';

export function OnboardingTileData() {
  const { createHrefToPath } = useNavigation();

  const createRedirectHref = (key: string): string => {
    switch (key) {
      case 'startIntegrating':
        return createHrefToPath(newOTelPageEnabled ? datasourceInstanaAgentPath : '/agents/installation');
      case 'traceInteractions':
        return 'https://ibm.biz/instana-tracing';
      case 'inviteUsers':
        return createHrefToPath(securityAndAccessAccessControlUsers);
      case 'appPerspective':
        return createHrefToPath('/applications');
      case 'smartAlerts':
        return createHrefToPath('/alerts;configsCategory=global');
      case 'startMonitoring':
        return createHrefToPath('/websiteMonitoring/websites');
      default:
        return createHrefToPath('/');
    }
  };

  return [
    {
      key: 'startIntegrating',
      title: t('in-plg:welcomepage.startIntegrating.title'),
      description: t('in-plg:welcomepage.startIntegrating.description'),
      href: createRedirectHref('startIntegrating'),
      trackingEvent: UNIT_ONBOARDING_START_INTEGRATING_CLICK,
      pictogram: Data_1
    },
    {
      key: 'traceInteractions',
      title: t('in-plg:welcomepage.traceInteractions.title'),
      description: t('in-plg:welcomepage.traceInteractions.description'),
      href: createRedirectHref('traceInteractions'),
      trackingEvent: UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK,
      pictogram: Explore,
      target: '_blank'
    },
    {
      key: 'smartAlerts',
      title: t('in-plg:welcomepage.smartAlerts.title'),
      description: t('in-plg:welcomepage.smartAlerts.description'),
      href: createRedirectHref('smartAlerts'),
      trackingEvent: UNIT_ONBOARDING_GET_ALERTED_CLICK,
      pictogram: NotificationNew
    },
    {
      key: 'inviteUsers',
      title: t('in-plg:welcomepage.inviteUsers.title'),
      description: t('in-plg:welcomepage.inviteUsers.description'),
      href: createRedirectHref('inviteUsers'),
      trackingEvent: UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK,
      pictogram: ShareKnowledge
    },
    {
      key: 'appPerspective',
      title: t('in-plg:welcomepage.appPerspective.title'),
      description: t('in-plg:welcomepage.appPerspective.description'),
      href: createRedirectHref('appPerspective'),
      trackingEvent: UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK,
      pictogram: AnalyticsCustom
    },
    {
      key: 'startMonitoring',
      title: t('in-plg:welcomepage.startMonitoring.title'),
      description: t('in-plg:welcomepage.startMonitoring.description'),
      href: createRedirectHref('startMonitoring'),
      trackingEvent: UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK,
      pictogram: CloudMonitoring
    }
  ];
}

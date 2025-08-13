/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { t } from '@instana/i18n-react';

import { VIDEO_INSTALLING_INSTANA, VIDEO_ADDING_AGENTS, VIDEO_MONITORWEBSITE } from 'in-services/tracking/eventNames';
export function GuidedVideoItems() {
  return [
    {
      embedId: 'lwMjPrNpyt4',
      title: t('in-plg:onboarding.videoitem.installation'),
      trackingEvent: VIDEO_INSTALLING_INSTANA
    },
    {
      embedId: 'pEl-Oj_11b4',
      title: t('in-plg:onboarding.videoitem.addingAgent'),
      trackingEvent: VIDEO_ADDING_AGENTS
    },
    {
      embedId: 'g_IynPTTcSY',
      title: t('in-plg:onboarding.videoitem.monitorWebsite'),
      trackingEvent: VIDEO_MONITORWEBSITE
    }
  ];
}

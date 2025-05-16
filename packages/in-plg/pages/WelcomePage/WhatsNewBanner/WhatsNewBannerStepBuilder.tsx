/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  KUBECOST_INTEGRATION_BUTTON_CLICKED,
  LOGS_IN_CONTEXT_BUTTON_CLICKED,
  TURBONOMETRIC_OPTIMIZATION_BUTTON_CLICKED,
  CONCERT_INTEGRATION_BUTTON_CLICKED
} from 'in-services/tracking/eventNames';
import { HeaderItemTile } from 'in-plg/components/HeaderItemTile/HeaderItemTile';
import { hasKubernetesAccess, hasApplicationsAccess } from 'in-stores/permission';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getValidButtonType } from 'in-plg/pages/WelcomePage/utils';
import { TileDataType } from 'in-plg/pages/WelcomePage/types';
import { role } from 'in-stores/user';

export default function WhatsNewBannerStepBuilder() {
  const { trackCta } = useSegmentTracking();
  const tileData: TileDataType[] = [
    {
      key: 'kubecost',
      title: t('in-plg:welcomepage.kubecost.title'),
      description: t('in-plg:welcomepage.kubecost.description'),
      buttonName: t('in-plg:welcomepage.kubecost.buttonName'),
      hasPermission: hasKubernetesAccess,
      buttonType: 'primary',
      onButtonClick: () => {
        trackCta(KUBECOST_INTEGRATION_BUTTON_CLICKED);
        //@ts-expect-error WalkMeAPI is loaded during runtime using walkme script
        //the id of the smart walk-thru is taken from walkme editor
        WalkMeAPI.startFlowById(2093256);
      }
    },
    {
      key: 'logging',
      title: t('in-plg:welcomepage.logging.title'),
      description: t('in-plg:welcomepage.logging.description'),
      buttonName: t('in-plg:welcomepage.logging.buttonName'),
      buttonType: 'ghost',
      hasPermission: role?.canViewLogs,
      onButtonClick: () => {
        trackCta(LOGS_IN_CONTEXT_BUTTON_CLICKED);
        //@ts-expect-error WalkMeAPI is loaded during runtime using walkme script
        //the id of the smart walk-thru is taken from walkme editor
        WalkMeAPI.startFlowById(2094310);
      }
    },
    {
      key: 'turbonometric',
      title: t('in-plg:welcomepage.turbonometric.title'),
      description: t('in-plg:welcomepage.turbonometric.description'),
      buttonName: t('in-plg:welcomepage.turbonometric.buttonName'),
      buttonType: 'ghost',
      hasPermission: hasApplicationsAccess,
      onButtonClick: () => {
        trackCta(TURBONOMETRIC_OPTIMIZATION_BUTTON_CLICKED);
        //@ts-expect-error WalkMeAPI is loaded during runtime using walkme script
        //the id of the smart walk-thru is taken from walkme editor
        WalkMeAPI.startFlowById(2103008);
      }
    },
    {
      key: 'concert',
      title: t('in-plg:welcomepage.concert.title'),
      description: t('in-plg:welcomepage.concert.description'),
      buttonName: t('in-plg:welcomepage.concert.buttonName'),
      buttonType: 'ghost',
      hasPermission: hasApplicationsAccess,
      onButtonClick: () => {
        trackCta(CONCERT_INTEGRATION_BUTTON_CLICKED);
        //@ts-expect-error WalkMeAPI is loaded during runtime using walkme script
        //the id of the smart walk-thru is taken from walkme editor
        WalkMeAPI.startFlowById(2103195);
      }
    }
  ];

  return (
    <Stack gap="xxlarge" direction="horizontal" distribution="start">
      {tileData.map((item: TileDataType) => (
        <div key={item.key}>
          <HeaderItemTile
            key={item.key}
            title={item.title}
            description={item.description}
            buttonName={item.buttonName}
            hasPermission
            buttonType={getValidButtonType(item.buttonType)}
            onButtonClick={item.onButtonClick}
          />
        </div>
      ))}
    </Stack>
  );
}

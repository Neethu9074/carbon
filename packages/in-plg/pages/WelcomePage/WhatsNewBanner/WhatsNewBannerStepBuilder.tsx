/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { KUBECOST_INTEGRATION_BUTTON_CLICKED, LOGS_IN_CONTEXT_BUTTON_CLICKED } from 'in-services/tracking/eventNames';
import { HeaderItemTile } from 'in-plg/components/HeaderItemTile/HeaderItemTile';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getValidButtonType } from 'in-plg/pages/WelcomePage/utils';
import { hasKubernetesAccess } from 'in-stores/permission';
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

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { t } from '@instana/i18n-react';

import useDoDeleteSloConfiguration from 'in-service-levels/hooks/useDoDeleteSloConfiguration';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';

interface Props {
  configuration: ServiceLevelObjectiveConfiguration;
  closeMenu?: () => void;
}

export default function DeleteSloMoreMenuButton({ configuration, closeMenu }: Props) {
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };
  const doDelete = useDoDeleteSloConfiguration(configuration, meta);
  return (
    <MoreMenuButton
      icon="lib_actions_delete"
      onClick={() => {
        closeMenu?.();
        doDelete();
      }}
    >
      {t('in-service-levels:general.deleteButtonLabel')}
    </MoreMenuButton>
  );
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography, Ul } from '@instana/components';

import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import {
  ProductArea,
  syntheticOtherCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getSyntheticAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getSyntheticAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

const sublistContent = (
  <Ul>
    <CapabilitySubsection
      capabilities={syntheticOtherCapabilities}
      headerText={t('in-settings:productAreas.additionalPermissions')}
    />
  </Ul>
);

export const SyntheticMonitoringSectionFullAccessContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getSyntheticAreaData({ area: ProductArea.SYNTHETICS, permissionsSet });

  return (
    <AreaExpandableListItem
      iconType="lib_synthetic"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_syntheticMonitoring')}
      subList={sublistContent}
      disabled={isDisabled}
    >
      <Typography variant="body-small">{t('in-settings:productAreas.allSynthetics')}</Typography>
    </AreaExpandableListItem>
  );
};

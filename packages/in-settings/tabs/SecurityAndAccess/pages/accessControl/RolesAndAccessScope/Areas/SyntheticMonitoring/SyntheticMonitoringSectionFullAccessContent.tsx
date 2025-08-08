/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography, Ul } from '@instana/components';

import {
  ProductArea,
  syntheticAdditionalOwnerCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { getSyntheticAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getSyntheticAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { syntheticsAccessPermissions } from 'in-stores/permission';
import { syntheticsEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';
import { t } from 'in-i18n';

const sublistContent = (
  <Ul>
    <CapabilitySubsection
      capabilities={syntheticAdditionalOwnerCapabilities}
      headerText={t('in-settings:productAreas.additionalPermissions')}
    />
  </Ul>
);

export const SyntheticMonitoringSectionFullAccessContent = () => {
  const hasSyntheticsAccess = useHasAccess({
    optionalPrecondition: syntheticsEnabled,
    requiredPermissions: syntheticsAccessPermissions
  });
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getSyntheticAreaData({
    area: ProductArea.SYNTHETICS,
    permissionsSet,
    hasSyntheticsAccess
  });

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

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getSyntheticAreaData } from '../utils/getSyntheticAreaData';
import { t } from 'in-i18n';

export const SyntheticMonitoringSectionFullAccessContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getSyntheticAreaData({ area: ProductArea.SYNTHETICS, permissionsSet });

  return (
    <AreaExpandableListItem
      iconType="lib_synthetic"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_syntheticMonitoring')}
      disabled={isDisabled}
    >
      <Typography variant="body-small">{t('in-settings:productAreas.allSynthetics')}</Typography>
    </AreaExpandableListItem>
  );
};

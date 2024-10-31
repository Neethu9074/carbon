/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography, Ul } from '@instana/components';

import {
  ProductArea,
  applicationAdditionalCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

const sublistContent = (
  <Ul>
    <CapabilitySubsection
      capabilities={applicationAdditionalCapabilities}
      headerText={t('in-settings:productAreas.additionalPermissions')}
    />
  </Ul>
);
export const ApplicationSectionFullAccessContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getAreaData({ area: ProductArea.APPLICATION, permissionsSet });

  return (
    <AreaExpandableListItem
      iconType="lib_application_invert"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_applications')}
      disabled={isDisabled}
      subList={sublistContent}
    >
      <Typography variant="body-small">{t('in-settings:productAreas.allApplications')}</Typography>
    </AreaExpandableListItem>
  );
};

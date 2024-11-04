/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography, Ul } from '@instana/components';

import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { Capability } from 'in-stores/permission';
import { t } from 'in-i18n';

export const WebsiteSectionFullAccessContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getAreaData({ area: ProductArea.WEBSITE, permissionsSet });

  return (
    <AreaExpandableListItem
      iconType="lib_website_inverted"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_websites')}
      disabled={isDisabled}
      subList={
        <Ul>
          <CapabilitySubsection
            capabilities={[Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS]}
            headerText={t('in-settings:productAreas.additionalPermissions')}
          />
        </Ul>
      }
    >
      <Typography variant="body-small">{t('in-settings:productAreas.allWebsites')}</Typography>
    </AreaExpandableListItem>
  );
};

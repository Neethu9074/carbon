/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { useMobileAppsConfigurations } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/MobileApps/hooks';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { Capability } from 'in-stores/permission';
import { t } from 'in-i18n';

export const MobileAppsSectionContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const [mobileApps, , , { loading }] = useMobileAppsConfigurations();
  const { areaColumnHeadline, areaItemIdsWithAccess, isDisabled } = getAreaData({
    area: ProductArea.MOBILE_APP,
    permissionsSet
  });

  const mobileAppsToDisplay = mobileApps?.filter(mobileApp => areaItemIdsWithAccess.includes(mobileApp.id));

  const listItemContent = mobileAppsToDisplay?.map(mobileAppData => (
    <Li noAlternatingBg key={mobileAppData.id}>
      <Typography variant="body-regular">{mobileAppData.name}</Typography>
    </Li>
  ));

  return (
    <AreaExpandableListItem
      iconType="lib_mobile_app_inverted"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_mobileApps')}
      loading={loading}
      subList={
        <Ul>
          {listItemContent}
          <CapabilitySubsection
            capabilities={[Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS]}
            headerText={t('in-settings:productAreas.additionalPermissions')}
          />
        </Ul>
      }
      disabled={isDisabled}
    />
  );
};

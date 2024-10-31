/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { useWebsiteConfigurations } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Websites/hooks';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { Capability } from 'in-stores/permission';
import { t } from 'in-i18n';

export const WebsiteSectionContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const [websites, , , { loading }] = useWebsiteConfigurations();
  const { areaColumnHeadline, areaItemIdsWithAccess, isDisabled } = getAreaData({
    area: ProductArea.WEBSITE,
    permissionsSet
  });

  const websitesConfigurationsWithAccess = websites?.filter(website => areaItemIdsWithAccess.includes(website.id));

  const listItemContent = websitesConfigurationsWithAccess?.map(websiteConfigurationData => (
    <Li noAlternatingBg key={websiteConfigurationData.id}>
      <Typography variant="body-regular">{websiteConfigurationData.name}</Typography>
    </Li>
  ));

  return (
    <AreaExpandableListItem
      iconType="lib_website_inverted"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_websites')}
      loading={loading}
      subList={
        <Ul>
          {listItemContent}
          <CapabilitySubsection
            capabilities={[Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS]}
            headerText={t('in-settings:productAreas.additionalPermissions')}
          />
        </Ul>
      }
      disabled={isDisabled}
    />
  );
};

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import { SubsectionHeader } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';
import { ApplicationSubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Applications/ApplicationSubsection';
import {
  ProductArea,
  applicationAdditionalCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { useApplicationsConfigurations } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Applications/hooks';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { Capability } from 'in-stores/permission';
import { t } from 'in-i18n';

export const ApplicationsSectionContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const [applications, , , { loading }] = useApplicationsConfigurations();
  const {
    areaColumnHeadline,
    areaItemIdsWithAccess,
    isDisabled,
    contributorAccessItemIds,
    contributorAccessHeadline,
    areaAccessHeadline,
    hasFullAreaAccess
  } = getAreaData({
    area: ProductArea.APPLICATION,
    permissionsSet
  });
  const applicationsToDisplay = applications?.filter(application => areaItemIdsWithAccess.includes(application.id));
  const contributorApplicationsToDisplay = applications?.filter(application =>
    contributorAccessItemIds?.includes(application.id)
  );

  const sublistContent = permissionsSet.restrictedApplicationFilter ? (
    <>
      {hasFullAreaAccess ? (
        <>
          <SubsectionHeader headerText={areaAccessHeadline || ''} />
          <Li noAlternatingBg>
            <Typography variant="body-small">
              {permissionsSet.permissions.includes(Capability.CAN_CONFIGURE_APPLICATIONS) &&
              contributorAccessItemIds &&
              contributorAccessItemIds?.length > 0
                ? t('in-settings:permissionScope.description_access_all_except_contributor')
                : t('in-settings:productAreas.allApplications')}
            </Typography>
          </Li>
        </>
      ) : (
        <ApplicationSubsection headerText={areaAccessHeadline} applicationsToDisplay={applicationsToDisplay} />
      )}

      <ApplicationSubsection
        headerText={contributorAccessHeadline}
        applicationsToDisplay={contributorApplicationsToDisplay}
      />
    </>
  ) : (
    applicationsToDisplay?.map(applicationData => {
      return (
        <Li noAlternatingBg key={applicationData.id}>
          <Typography variant="body-regular">{applicationData.label}</Typography>
        </Li>
      );
    })
  );

  return (
    <AreaExpandableListItem
      iconType="lib_application_invert"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_applications')}
      loading={loading}
      subList={
        <Ul>
          {sublistContent}
          <CapabilitySubsection
            capabilities={applicationAdditionalCapabilities}
            headerText={t('in-settings:productAreas.additionalPermissions')}
          />
        </Ul>
      }
      disabled={isDisabled}
    />
  );
};

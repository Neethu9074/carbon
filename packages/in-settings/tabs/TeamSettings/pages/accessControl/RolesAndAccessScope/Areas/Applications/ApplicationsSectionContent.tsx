/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import { useApplicationsConfigurations } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Applications/hooks';
import { getAreaData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export const ApplicationsSectionContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const [applications, , , { loading }] = useApplicationsConfigurations();
  const { areaColumnHeadline, areaItemIdsWithAccess } = getAreaData({ area: ProductArea.APPLICATION, permissionsSet });

  const applicationsToDisplay = applications?.filter(application => areaItemIdsWithAccess.includes(application.id));

  const sublistContent = applicationsToDisplay?.map(applicationData => {
    return (
      <Li noAlternatingBg key={applicationData.id}>
        <Typography variant="body-regular">{applicationData.label}</Typography>
      </Li>
    );
  });

  return (
    <AreaExpandableListItem
      iconType="lib_application_invert"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.application')}
      loading={loading}
      subList={<Ul>{sublistContent}</Ul>}
    />
  );
};

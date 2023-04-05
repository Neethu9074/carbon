/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import { getAreaData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export const ApplicationSectionFullAccessContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getAreaData({ area: ProductArea.APPLICATION, permissionsSet });

  return (
    <AreaExpandableListItem
      iconType="lib_application_invert"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_applications')}
      disabled={isDisabled}
    >
      <Typography variant="body-small">{t('in-settings:productAreas.allApplications')}</Typography>
    </AreaExpandableListItem>
  );
};

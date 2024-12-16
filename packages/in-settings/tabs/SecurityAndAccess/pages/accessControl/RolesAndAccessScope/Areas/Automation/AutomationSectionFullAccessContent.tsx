/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { Typography } from '@instana/components';

import { AutomationSubListSection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/Automation/AutomationSubListSection';
import { getAutomationAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAutomationAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export const AutomationFullAccessContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getAutomationAreaData({ area: ProductArea.AUTOMATION, permissionsSet });

  return (
    <AreaExpandableListItem
      iconType="lib_automation"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_automation')}
      disabled={isDisabled}
      subList={<AutomationSubListSection />}
    >
      <Typography variant="body-small">{t('in-settings:productAreas.allActions')}</Typography>
    </AreaExpandableListItem>
  );
};

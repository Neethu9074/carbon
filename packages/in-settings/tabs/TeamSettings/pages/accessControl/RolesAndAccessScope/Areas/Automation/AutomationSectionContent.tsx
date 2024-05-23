/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { AutomationSubListSection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/Automation/AutomationSubListSection';
import { getAutomationAreaData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getAutomationAreaData';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export const AutomationSectionContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { areaColumnHeadline, isDisabled } = getAutomationAreaData({
    area: ProductArea.AUTOMATION,
    permissionsSet
  });

  return (
    <AreaExpandableListItem
      iconType="lib_automation"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_automation')}
      subList={<AutomationSubListSection />}
      disabled={isDisabled}
    />
  );
};

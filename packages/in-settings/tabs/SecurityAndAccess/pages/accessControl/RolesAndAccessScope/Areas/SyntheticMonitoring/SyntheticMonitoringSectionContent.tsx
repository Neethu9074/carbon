/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import { SyntheticTestList } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/SyntheticMonitoring/SyntheticTestList';
import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import {
  ProductArea,
  syntheticOtherCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getSyntheticAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getSyntheticAreaData';
import { useSyntheticTests } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/SyntheticMonitoring/hooks';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

export const SyntheticMonitoringSectionContent = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const [syntheticTests, , , { loading }] = useSyntheticTests();
  const { areaItemIdsWithAccess, areaColumnHeadline, isDisabled } = getSyntheticAreaData({
    area: ProductArea.SYNTHETICS,
    permissionsSet
  });

  const syntheticTestsToDisplay =
    syntheticTests?.filter(syntheticTest => areaItemIdsWithAccess.includes(syntheticTest.id)) ?? [];
  const syntheticTestList = () => (
    <>
      <SyntheticTestList syntheticTestsToDisplay={syntheticTestsToDisplay} />
    </>
  );

  const sublistContent = (
    <Ul>
      {syntheticTestList()}
      <CapabilitySubsection
        capabilities={syntheticOtherCapabilities}
        headerText={t('in-settings:productAreas.additionalPermissions')}
      />
    </Ul>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_synthetic"
      firstColumnHeadline={areaColumnHeadline}
      firstColumnLabel={t('in-settings:productAreas.title_syntheticMonitoring')}
      loading={loading}
      subList={sublistContent}
      disabled={isDisabled}
    />
  );
};

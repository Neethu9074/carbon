/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getAllBusinessPerspectivesForEntitySelectionWithDefaults } from 'in-bizops/subscriptions/helpers/getAllBusinessPerspectivesForEntitySelectionWithDefaults';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { AreaPermission, LimitedAccessScope } from 'in-stores/permission';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export const BusinessMonitoringSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const timeConfig = useTimeConfig();

  const perspectives = useObservable(getAllBusinessPerspectivesForEntitySelectionWithDefaults({ timeConfig }), [
    timeConfig
  ]);
  const permissionSetPerspectiveIds =
    permissionsSet.businessPerspectiveIds &&
    permissionsSet.businessPerspectiveIds.map(permissionScope => permissionScope.scopeId);
  const perspectivesWithAccess =
    perspectives?.data &&
    perspectives?.data.filter(perspective => permissionSetPerspectiveIds?.includes(perspective.id));

  const listItemContent = perspectivesWithAccess?.map(perspective => (
    <Li noAlternatingBg key={perspective.id}>
      <Typography variant="body-regular">{perspective.name}</Typography>
    </Li>
  ));

  const hasAllBizOpsAccess = !permissionsSet.permissions.includes(LimitedAccessScope.LIMITED_BIZOPS_SCOPE);
  const hasLimitedBizopsAccess =
    permissionsSet.permissions.includes(AreaPermission.ACCESS_BIZOPS) && !hasAllBizOpsAccess;
  const hasNoBizOpsAccess = !hasAllBizOpsAccess && !hasLimitedBizopsAccess;

  let context = 'no_access';
  if (hasAllBizOpsAccess) context = 'access_all';
  if (hasLimitedBizopsAccess) context = 'limited_access';

  const props = {
    iconType: 'lib_bizops',
    firstColumnHeadline: t('in-settings:permissionScope.selection', {
      context: context
    }),
    firstColumnLabel: t('in-settings:productAreas.title_businessMonitoring'),
    disabled: hasNoBizOpsAccess
  };

  if (hasAllBizOpsAccess) {
    return (
      <AreaExpandableListItem {...props}>
        <Typography variant="body-small">{t('in-settings:productAreas.businessMonitoringAccessAllMessage')}</Typography>
      </AreaExpandableListItem>
    );
  } else if (hasLimitedBizopsAccess) {
    return (
      <AreaExpandableListItem
        loading={perspectives?.progress.loading}
        subList={<Ul>{listItemContent}</Ul>}
        {...props}
      />
    );
  } else {
    return <AreaExpandableListItem {...props} />;
  }
};

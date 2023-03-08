/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Typography, Ul } from '@instana/components';

import { getCapabilitiesSectionData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getCapabilitiesSectionData';
import { CapabilitySubsection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { eventCapabilities } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export const EventsAndAlertsSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const { columnHeadline } = getCapabilitiesSectionData({
    area: ProductArea.EVENT,
    permissionsSet
  });

  return (
    <AreaExpandableListItem
      iconType="lib_events_inverted"
      firstColumnHeadline={columnHeadline}
      firstColumnLabel={t('in-settings:productAreas.event')}
      subList={
        <Ul>
          <CapabilitySubsection
            capabilities={eventCapabilities}
            headerText={t('in-settings:productAreas.permissions', { context: ProductArea.EVENT })}
          />
        </Ul>
      }
    >
      <Typography variant="body-small">{t('in-settings:productAreas.eventsAndAlertsContentMessage')}</Typography>
    </AreaExpandableListItem>
  );
};

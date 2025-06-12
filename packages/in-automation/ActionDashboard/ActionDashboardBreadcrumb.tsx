/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonStack, Link, SvgIcon } from '@instana/components';

import { actionCatalogFullyQualified } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import { t } from 'in-i18n';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

function ActionDashboardBreadcrumb() {
  const { location, navigate } = useNavigation();
  const from = location.query.from;
  let backLabel = from === eventsPath ? t('in-automation:backToEvent') : t('in-automation:backToActionCatalog');
  const handleBack = () => {
    delete location.query.from;
    if (from === eventsPath) {
      location.pathname = eventsPath;
      const eventObj = JSON.parse(location.query.eventState as string);
      delete location.query.eventState;
      for (const key in eventObj) {
        setOrDeleteMatrixKey(location, eventsPath, key, eventObj[key]);
      }
    } else {
      location.pathname = actionCatalogFullyQualified;
    }
    navigate(location);
  };
  if (!from) return null;
  return (
    <CarbonStack orientation="horizontal">
      <Link className={local.link} onClick={handleBack}>
        <SvgIcon type="lib_arrow_expand_left" className={local.icon} />
        {backLabel}
      </Link>
    </CarbonStack>
  );
}

export default ActionDashboardBreadcrumb;

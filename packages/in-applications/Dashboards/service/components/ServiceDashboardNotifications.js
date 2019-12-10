import React from 'react';

import InboundOrAllCallsNotification from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsNotification';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { switchScope } from 'in-applications/constants';

import locals from './ServiceDashboardNotifications.mless';

export default function ServiceDashboardNotifications({ currentTab, applicationId, serviceId, boundaryScope }) {
  if (!applicationId) {
    return null;
  }

  return (
    <div className={locals.wrapper}>
      <InboundOrAllCallsNotification
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        entityType="service"
        switchTo={getServiceDashboard(serviceId, {
          applicationId,
          boundaryScope: switchScope(boundaryScope),
          tab: currentTab
        })}
      />
    </div>
  );
}

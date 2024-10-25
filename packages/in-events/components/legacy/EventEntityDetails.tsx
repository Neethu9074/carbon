/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

//@ts-expect-error
import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
//@ts-expect-error
import { isMobileAppSmartAlertEvent, isSloSmartAlertEvent } from 'in-events/components/eventUtil';
//@ts-expect-error
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
//@ts-expect-error
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
//@ts-expect-error
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { extendWindowSizeForLateData } from 'in-events/components/EventContent/analyzeUtils';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import SloScopePath from 'in-alerting/smart-alerts/slo/components/SloScopePath';
import useMobileAppEventEntity from 'in-events/hooks/useMobileAppEventEntity';
import useSloEventEntity from 'in-events/hooks/useSloEventEntity';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { EventOrMap } from 'in-events/types';

export default function EventEntityDetails({
  triggeringEvent,
  timeConfig,
  shouldDisplayDefaultLabel = true
}: {
  triggeringEvent: EventOrMap;
  timeConfig: TimeConfig;
  shouldDisplayDefaultLabel?: Boolean;
}) {
  if (isSloSmartAlertEvent(triggeringEvent)) {
    return <SloDetailsHeaderEntity triggeringEvent={triggeringEvent} />;
  } else if (isWebsiteSmartAlertEvent(triggeringEvent)) {
    return <WebsiteDetailsHeaderEntity triggeringEvent={triggeringEvent} />;
  } else if (isApplicationSmartAlertEvent(triggeringEvent)) {
    return <ApplicationEntityDetails triggeringEvent={triggeringEvent} />;
  } else if (isMobileAppSmartAlertEvent(triggeringEvent)) {
    return <MobileAppDetailsHeaderEntity triggeringEvent={triggeringEvent} />;
  }

  return (
    <EntityWithParentInformation
      entityId={triggeringEvent.get('entityId')}
      entityType={triggeringEvent.get('entityType')}
      metadata={triggeringEvent.get('metadata')}
      timeConfig={timeConfig}
      linkTimeConfig={getTimeConfigFromEvent(triggeringEvent)}
      shouldDisplayDefaultLabel={shouldDisplayDefaultLabel}
    />
  );
}

function ApplicationEntityDetails({ triggeringEvent }: { triggeringEvent: EventOrMap }) {
  const alertConfig = useApplicationEventAlertConfig(triggeringEvent);
  const eventEntity = useApplicationEventEntity(triggeringEvent);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const extendedDashboardTimeConfig = extendWindowSizeForLateData(
    getTimeConfigFromEvent(triggeringEvent),
    alertConfig.granularity
  );

  return (
    <ApplicationScopePath
      {...eventEntity}
      boundaryScope={alertConfig.boundaryScope}
      timeConfig={extendedDashboardTimeConfig}
      iconSize="xs"
      showDashboardLinks
      noBottomMargin
    />
  );
}

function WebsiteDetailsHeaderEntity({ triggeringEvent }: { triggeringEvent: EventOrMap }) {
  const eventEntity = useWebsiteEventEntity(triggeringEvent);

  if (!eventEntity) {
    return null;
  }

  return (
    <WebsiteScopePath
      {...eventEntity}
      timeConfig={getTimeConfigFromEvent(triggeringEvent)}
      iconSize="xs"
      showDashboardLinks
      noBottomMargin
    />
  );
}

function MobileAppDetailsHeaderEntity({ triggeringEvent }: { triggeringEvent: EventOrMap }) {
  const eventEntity = useMobileAppEventEntity(triggeringEvent);

  if (!eventEntity) {
    return null;
  }

  return <MobileAppScopePath {...eventEntity} iconSize="xs" showDashboardLinks noBottomMargin />;
}

function SloDetailsHeaderEntity({ triggeringEvent }: { triggeringEvent: EventOrMap }) {
  const eventEntity = useSloEventEntity(triggeringEvent);

  if (!eventEntity) return <></>;

  return (
    <SloScopePath
      sloId={eventEntity.sloConfig.id!}
      sloLabel={eventEntity.sloConfig.name}
      entityType={eventEntity.sloConfig.entity.type}
      entityId={eventEntity.entityId}
      entityLabel={eventEntity.entityLabel}
      boundaryScope={eventEntity.boundaryScope}
      timeConfig={getTimeConfigFromEvent(triggeringEvent)}
    />
  );
}

function isWebsiteSmartAlertEvent(triggeringEvent: EventOrMap) {
  return triggeringEvent.hasIn(['metadata', 'websiteId']);
}

function isApplicationSmartAlertEvent(triggeringEvent: EventOrMap) {
  return triggeringEvent.hasIn(['metadata', 'applicationId']);
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import { noop } from 'lodash';
import React from 'react';

import { CarbonComboButton } from '@instana/components';
import { Snapshot, TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

// @ts-expect-error No typedef available
import { isWebsiteSmartAlertEvent, isApplicationSmartAlertEvent } from 'in-events/components/legacy/EventListItem';
// @ts-expect-error No typedef available
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
// @ts-expect-error No typedef available
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
// @ts-expect-error No typedef available
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
//  @ts-expect-error No typedef available
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
// @ts-expect-error No typedef available
import { getEventViewWithTimeFocusedAt } from 'in-events/components/legacy/EventListItem';
// @ts-expect-error No typedef available
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
// @ts-expect-error No typedef available
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
//  @ts-expect-error No typedef available
import { isMobileAppSmartAlertEvent } from 'in-events/components/eventUtil';
// @ts-expect-error No typedef available
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
// @ts-expect-error No typedef available
import { isSloSmartAlertEvent } from 'in-events/components/eventUtil';
import DisableEventConfigButton from 'in-events/components/tabs/Summary/DisableEventConfigButton';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import AnalyzeMobileAppEventButton from 'in-events/components/AnalyzeMobileAppEventButton';
import MobileAppAlertConfigButton from 'in-events/components/MobileAppAlertConfigButton';
import useMobileAppEventAlertConfig from 'in-events/hooks/useMobileAppEventAlertConfig';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import useSloAlertConfig from 'in-alerting/smart-alerts/slo/hooks/useSloAlertConfig';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import AnalyzeSloEventButton from 'in-events/components/AnalyzeSloEventButton';
import { aqmDisableConfigOnEventViewEnabled } from 'in-services/featureFlags';
import useMobileAppEventEntity from 'in-events/hooks/useMobileAppEventEntity';
import SloAlertConfigButton from 'in-events/components/SloAlertConfigButton';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import useSloEventEntity from 'in-events/hooks/useSloEventEntity';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { EventOrMap } from 'in-events/types';
import { role } from 'in-stores/user';

interface IncidentActionsProps {
  incident: EventOrMap;
  triggeringEvent: EventOrMap;
  latestSnapshot: Snapshot;
}

const IncidentActions = ({ incident, triggeringEvent, latestSnapshot }: IncidentActionsProps) => {
  const { location, navigate } = useNavigation();
  const canCloseManually = role?.canManuallyCloseIssue;
  const timeConfig = canCloseManually && incident ? getTimeConfigForSnapshotRetrieval(incident, latestSnapshot) : null;
  const { windowSize } = useTimeConfig();

  if (!triggeringEvent) return <></>;

  const triggeringEventUrl = getEventViewWithTimeFocusedAt(
    triggeringEvent.get('start'),
    windowSize,
    location,
    triggeringEvent.get('id'),
    triggeringEvent.get('type')
  );

  return (
    <CarbonComboButton
      label={t('in-events:incident.actionOpenTriggeringEvent')}
      size="sm"
      onClick={e => {
        e.preventDefault();
        navigate(triggeringEventUrl);
      }}
    >
      <IncidentActionsByType triggeringEvent={triggeringEvent} />
      {renderCloseButton(incident, canCloseManually, timeConfig)}
      {renderDisableButton(incident)}
    </CarbonComboButton>
  );
};

interface IncidentActionsByTypeProps {
  triggeringEvent: EventOrMap;
}

const IncidentActionsByType = ({ triggeringEvent }: IncidentActionsByTypeProps) => {
  if (isSloSmartAlertEvent(triggeringEvent)) {
    return <SloActions event={triggeringEvent} />;
  } else if (isWebsiteSmartAlertEvent(triggeringEvent)) {
    return <WebsiteSmartAlertActions event={triggeringEvent} />;
  } else if (isApplicationSmartAlertEvent(triggeringEvent)) {
    return <ApplicationSmartAlertActions event={triggeringEvent} />;
  } else if (isMobileAppSmartAlertEvent(triggeringEvent)) {
    return <MobileAppSmartAlertActions event={triggeringEvent} />;
  }
  return <GenericAlertActions event={triggeringEvent} />;
};

interface ActionProps {
  event: EventOrMap;
}

const GenericAlertActions = ({ event }: ActionProps) => {
  return (
    <>
      <EventSpecificationLink as="menuItem" event={event.toJS()} />
      <AnalyzeIssueCallsButton as="menuItem" event={event} />
    </>
  );
};

const MobileAppSmartAlertActions = ({ event }: ActionProps) => {
  const eventEntity = useMobileAppEventEntity(event);
  const alertConfig = useMobileAppEventAlertConfig(event);
  if (!eventEntity || !alertConfig) {
    return null;
  }

  return (
    <>
      <MobileAppAlertConfigButton as="menuItem" alertConfig={alertConfig} />
      <AnalyzeMobileAppEventButton
        as="menuItem"
        alertConfig={alertConfig}
        mobileAppName={eventEntity.mobileAppName}
        timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
      />
    </>
  );
};

const ApplicationSmartAlertActions = ({ event }: ActionProps) => {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const { applicationId } = eventEntity;
  const isGlobalSmartAlert = event.getIn(['metadata', 'globalSmartAlert'], false);
  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], Map({})) ?? Map({});

  return (
    <>
      <ApplicationAlertConfigButton
        as="menuItem"
        applicationId={applicationId}
        alertConfig={alertConfig}
        isGlobalSmartAlert={isGlobalSmartAlert}
      />
      <AnalyzeApplicationEventButton
        as="menuItem"
        {...eventEntity}
        alertConfig={alertConfig}
        timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
        adaptiveBaselineInfo={adaptiveBaselineInfo.toJS()}
      />
    </>
  );
};

const WebsiteSmartAlertActions = ({ event }: ActionProps) => {
  const alertConfig = useWebsiteEventAlertConfig(event);
  const eventEntity = useWebsiteEventEntity(event);
  if (!eventEntity || !alertConfig) {
    return null;
  }

  return (
    <>
      <WebsiteAlertConfigButton as="menuItem" alertConfig={alertConfig} />
      <AnalyzeWebsiteEventButton
        as="menuItem"
        alertConfig={alertConfig}
        websiteName={eventEntity.websiteName}
        timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
      />
    </>
  );
};

const SloActions = ({ event }: ActionProps) => {
  const timeConfig = getTimeConfigFromEvent(event);
  const configId = event.getIn(['metadata', 'eventSpecificationId']);
  const eventEntity = useSloEventEntity(event);
  const [alertConfig] = useSloAlertConfig({ id: configId });
  if (!eventEntity || !alertConfig) return <></>;

  return (
    <>
      <SloAlertConfigButton as="menuItem" sloId={eventEntity.sloConfig.id!} alertConfig={alertConfig} />
      <AnalyzeSloEventButton as="menuItem" sloConfig={eventEntity.sloConfig} timeConfig={timeConfig} />
    </>
  );
};

function renderCloseButton(incident: EventOrMap, canCloseManually: boolean | undefined, timeConfig: TimeConfig | null) {
  return incident && canCloseManually ? (
    <ManualCloseIssueButton
      buttonKind="subtle"
      eventType="incident"
      event={incident}
      buttonType="menuItem"
      iconComponent={
        <EventIcon event={incident} tooltipLabel={getEventSeverityLabelWithEventType(incident, timeConfig)} />
      }
      reload={noop}
    />
  ) : null;
}

function renderDisableButton(incident: EventOrMap) {
  return incident && aqmDisableConfigOnEventViewEnabled ? (
    <DisableEventConfigButton
      event={incident}
      buttonKind="subtle"
      eventType="incident"
      buttonType="menuItem"
      reload={noop}
    />
  ) : null;
}

export default IncidentActions;

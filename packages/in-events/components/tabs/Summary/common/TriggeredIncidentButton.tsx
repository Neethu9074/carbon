/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

// @ts-expect-error no typedef yet
import { getEventUrl } from 'in-events/components/legacy/EventListItem';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

interface TriggeredIncidentButtonProps {
  event: EventOrMap;
}

const TriggeredIncidentButton = ({ event }: TriggeredIncidentButtonProps) => {
  const triggeredIncident = event.getIn(['metadata', 'triggeredIncident'], '');
  const hasTriggeredIncident = !isEmpty(triggeredIncident);
  const { location, navigate } = useNavigation();

  const goToIncident = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    const incidentURL = getEventUrl(triggeredIncident, location, 'incident');
    navigate(incidentURL);
  };

  if (!hasTriggeredIncident) {
    return <></>;
  }

  return (
    <Button kind="secondary" onClick={goToIncident} size="normal">
      {t('in-events:issues.actionOpenTriggeredIncident')}
    </Button>
  );
};

export default TriggeredIncidentButton;

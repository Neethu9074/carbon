/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo } from 'react';

import { CustomEventSpecificationWithMetadata } from '@instana/types/typeDefinitions';
// @ts-expect-error export needs types
import { empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import {
  smartAlertMigrationDocs,
  MessageContentModernDesign
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import { isDeprecatedAppDataEntityType } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { applicationsAlertingShowDeprecationBanner } from 'in-alerting/smart-alerts/applications/tracker';
import { getCustomEventSpecificationMutable } from 'in-api/eventSpecifications';
import { Col, Row } from 'in-components/layout/Grid';
import { Event } from 'in-types';
import { Trans } from 'in-i18n';

interface Props {
  event: Event;
  isIncident: boolean;
}

export function DeprecatedCustomEventWarning({ event, isIncident }: Props) {
  const eventId = event?.metadata?.eventSpecificationId ?? '';
  const isDeprecatedCustomEvent = useMemo(
    () =>
      isDeprecatedAppDataEntityType(event?.plugin ?? '') &&
      !event?.metadata?.applicationId &&
      (event?.metadata?.custom_issue ?? false),
    [event]
  );

  const customEventConfigOrEmpty = useObservable<CustomEventSpecificationWithMetadata, [boolean]>(() => {
    if (isDeprecatedCustomEvent) {
      return getCustomEventSpecificationMutable(eventId);
    }

    return empty;
  }, [isDeprecatedCustomEvent]);

  const showBanner =
    isDeprecatedCustomEvent &&
    customEventConfigOrEmpty &&
    !customEventConfigOrEmpty?.migrated &&
    !customEventConfigOrEmpty?.deleted;

  useEffect(() => {
    if (showBanner) {
      applicationsAlertingShowDeprecationBanner({});
    }
  }, [showBanner]);

  return (
    Boolean(showBanner) && (
      <Row withoutSideMargin>
        <Col xs>
          <Message type="warning" withIcon>
            <MessageContentModernDesign>
              <Trans
                i18nKey="in-events:deprecatedCustomEventWarning"
                components={{
                  documentationLink: smartAlertMigrationDocs
                }}
                values={{ issueOrIncident: isIncident ? 'incident' : 'issue' }}
              />
            </MessageContentModernDesign>
          </Message>
        </Col>
      </Row>
    )
  );
}

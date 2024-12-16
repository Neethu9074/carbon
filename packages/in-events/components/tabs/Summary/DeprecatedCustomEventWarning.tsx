/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { CustomEventSpecificationWithMetadata } from '@instana/types/typeDefinitions';
// @ts-expect-error export needs types
import { empty } from '@instana/observables';
import { Link, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  MessageContentModernDesign,
  onLinkClickForSegmentTracking,
  smartAlertMigrationUrl
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import { isDeprecatedAppDataEntityType } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import { getCustomEventSpecificationMutable } from 'in-api/eventSpecifications';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { Col, Row } from 'in-components/layout/Grid';
import { Event } from 'in-types';
import { Trans } from 'in-i18n';

interface Props {
  event: Event;
  isIncident: boolean;
}

export function DeprecatedCustomEventWarning({ event, isIncident }: Props) {
  const { trackCta } = useSegmentTracking();
  const smartAlertMigrationDocs = (
    <Link href={smartAlertMigrationUrl} onClick={() => onLinkClickForSegmentTracking(trackCta)} external>
      &nbsp;
    </Link>
  );

  const eventId = event?.metadata?.eventSpecificationId ?? '';
  const isDeprecatedCustomEvent = useMemo(
    () =>
      isDeprecatedAppDataEntityType(event?.plugin ?? '') &&
      !event?.metadata?.applicationId &&
      !event?.metadata?.sloId && // SLO Smart Alerts can also be on AP entity
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

  return (
    Boolean(showBanner) && (
      <Row withoutSideMargin>
        <Col xs>
          <Message type="warning" withIcon fullInlineWidth>
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

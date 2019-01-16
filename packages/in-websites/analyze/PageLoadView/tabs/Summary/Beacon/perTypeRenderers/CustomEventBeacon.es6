import React, { Fragment } from 'react';

import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import BatchIndicator from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import Stack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Stack';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { millis } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';

export const getLabel = beacon => beacon.customEventName;

export const getExtraTooltipFields = beacon => ({
  Duration: millis.fixedCompact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp, toggleExpanded }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          Event
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      onClick={toggleExpanded}
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label="Start Time"
      value={`+${millis.compact(beacon.timestamp - earliestTimestamp)}`}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader label="Duration" value={millis.fixedCompact(beacon.duration)} />
  </Fragment>
);

export const Body = ({ beacon }) => {
  const hasError = isNotBlank(beacon.errorMessage);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>Custom Event</BodyHeader>

          <Dl>
            <Di title="Event Name">{beacon.customEventName}</Di>
            <Di title="URI">
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <BackendDi beacon={beacon} />
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>Meta</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {hasError && (
        <Fragment>
          <Row>
            <Col lg={6}>
              <BodyHeader>Error Details</BodyHeader>

              {!isScriptError(beacon.errorMessage) && (
                <Dl>
                  <Di title="Error Message">{beacon.errorMessage}</Di>
                  <Di title="Error Type">{beacon.errorType}</Di>
                </Dl>
              )}

              {isScriptError(beacon.errorMessage) && (
                <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
              )}
            </Col>
          </Row>

          <Row>
            {isNotBlank(beacon.stackTrace) && (
              <Col lg={6}>
                <BodyHeader>Stack Trace</BodyHeader>
                <Stack stack={beacon.stackTrace} />
              </Col>
            )}

            {isNotBlank(beacon.componentStack) && (
              <Col lg={6}>
                <BodyHeader>Component Stack</BodyHeader>
                <Stack stack={beacon.componentStack} />
              </Col>
            )}
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};

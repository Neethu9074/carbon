import React, { Fragment } from 'react';

import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import BatchIndicator from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import Stack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Stack';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';

export const getLabel = beacon => beacon.errorMessage;

export const getExtraTooltipFields = () => ({});

export const LeftHeader = ({ beacon, earliestTimestamp, toggleExpanded }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          JS Error
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      onClick={toggleExpanded}
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label="Start Time"
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>Error Details</BodyHeader>

          {!isScriptError(beacon.errorMessage) && (
            <Dl>
              <Di title="Window Location">
                <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                  {beacon.locationUrl}
                </a>
              </Di>
              <Di title="Error Message">{beacon.errorMessage}</Di>
              <Di title="Error Type">{beacon.errorType}</Di>
            </Dl>
          )}

          {isScriptError(beacon.errorMessage) && (
            <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
          )}
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>Meta</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      <Row>
        {!isScriptError(beacon.errorMessage) &&
          isNotBlank(beacon.stackTrace) && (
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
  );
};

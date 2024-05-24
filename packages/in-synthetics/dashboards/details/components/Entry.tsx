/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment, useState } from 'react';

import { toInteractiveElement, Pill } from '@instana/components';
import { t } from '@instana/i18n-react';

import { bytesZeroDecimalPlaces, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import BrowserTimeline from 'in-synthetics/dashboards/details/components/browser/BrowserTimeline';
import { Di, Dl } from 'in-components/HorizontalDescriptionList/HorizontalDescriptionList';
import KeyValueHeader from 'in-synthetics/dashboards/details/components/KeyValueHeader';
import ToggleIcon from 'in-synthetics/dashboards/details/components/ToggleIcon';
import Timings from 'in-synthetics/dashboards/details/components/Timings';
import { getType, types } from 'in-synthetics/utils/browserFileTypes';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { TestResultEntry } from 'in-synthetics/utils/constants';
import { Row, Col } from 'in-components/layout/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from 'in-synthetics/dashboards/details/components/Entry.mless';

interface EntryProps {
  entry: TestResultEntry;
  earliestTimestamp: number;
  endTimestamp: number;
}

const Entry = ({ entry, earliestTimestamp, endTimestamp }: EntryProps) => {
  const { width, ref } = useResizeObserverCustom<HTMLDivElement>();
  const [expanded, setExpanded] = useState(false);
  const type = getType(entry.response.content.type?.toLowerCase());
  // @ts-expect-error Element has any type
  const typeDefinition = types[type];

  return (
    <div
      {...toInteractiveElement({
        ariaLabel: expanded
          ? t('in-synthetics:dashboard.detailsPage.showLessSubDetails')
          : t('in-synthetics:dashboard.detailsPage.showMoreSubDetails'),
        onDefaultInteraction: () => setExpanded(!expanded)
      })}
    >
      <div className={locals.entry}>
        <div ref={ref} className={locals.leftHeader}>
          <Tooltip content={typeDefinition.long} align="rightMiddle">
            <Pill type={typeDefinition.color} className={locals.type}>
              {typeDefinition.short}
            </Pill>
          </Tooltip>
          <Fragment>
            <KeyValueHeader
              value={''}
              label={entry.request.url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
            />
            <KeyValueHeader
              label={t('in-synthetics:dashboard.detailsPage.browserDetails.entry.status')}
              value={entry.response.status}
            />
            <KeyValueHeader
              label={t('in-synthetics:dashboard.detailsPage.browserDetails.entry.size')}
              value={`${bytesZeroDecimalPlaces(entry.response.size)}`}
            />
            <KeyValueHeader
              label={t('in-synthetics:dashboard.detailsPage.browserDetails.entry.time')}
              value={`${millisToTwoDecimalSeconds(entry.time)}`}
            />
            <BrowserTimeline
              width={(width || 1500) / 2}
              entriesToRender={[entry]}
              earliestTimestamp={earliestTimestamp}
              endTimestamp={endTimestamp}
            />
          </Fragment>
        </div>
        <div className={locals.rightHeader}>
          <ToggleIcon expanded={expanded} />
        </div>
      </div>
      {expanded && (
        <div className={locals.body}>
          <EntryBody entry={entry} />
        </div>
      )}
    </div>
  );
};

interface EntryBodyProps {
  entry: TestResultEntry;
}

const EntryBody = ({ entry }: EntryBodyProps) => {
  const { blocked, dns, connect, ssl, send, wait, receive } = entry.timings;
  const {
    url,
    httpVersion: httpRequestVersion,
    method,
    headersSize: headersRequestSize,
    bodySize: bodyRequestSize
  } = entry.request;
  const {
    redirectURL,
    httpVersion: httpResponseVersion,
    status,
    statusText,
    _transferSize,
    headersSize: headersResponseSize,
    bodySize: bodyResponseSize,
    content
  } = entry.response;

  const timings = [
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.blocking'),
      value: blocked
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.dns'),
      value: dns
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.connect'),
      value: connect
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.ssl'),
      value: ssl
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.sending'),
      value: send
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.waiting'),
      value: wait
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.receiving'),
      value: receive
    }
  ];

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <h2>{t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.title')}</h2>
          <Dl>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.url')}>
              <a href={url} rel="noopener noreferrer" target="_blank">
                {url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
              </a>
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.httpVersion')}>
              {httpRequestVersion}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.method')}>{method}</Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.headerSize')}>
              {bytesZeroDecimalPlaces(headersRequestSize < 0 ? 0 : headersRequestSize)}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.bodySize')}>
              {bytesZeroDecimalPlaces(bodyRequestSize < 0 ? 0 : bodyRequestSize)}
            </Di>
          </Dl>
        </Col>
        <Col lg={4}>
          <h2>{t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.title')}</h2>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.redirectUrl')}>
            <a href={redirectURL} rel="noopener noreferrer" target="_blank">
              {redirectURL || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
            </a>
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.httpVersion')}>
            {httpResponseVersion}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.status')}>
            {`${status} ${statusText}`}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.transferSize')}>
            {bytesZeroDecimalPlaces(_transferSize < 0 ? 0 : _transferSize)}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.headerSize')}>
            {bytesZeroDecimalPlaces(headersResponseSize < 0 ? 0 : headersResponseSize)}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.bodySize')}>
            {bytesZeroDecimalPlaces(bodyResponseSize < 0 ? 0 : bodyResponseSize)}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.contentType')}>
            {content.mimeType}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.contentSize')}>
            {bytesZeroDecimalPlaces(content.size < 0 ? 0 : content.size)}
          </Di>
        </Col>
        <Col lg={4}>
          <h2>{t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.title')}</h2>
          <Timings timings={timings} duration={entry.time} />
        </Col>
      </Row>
    </Fragment>
  );
};

export default Entry;

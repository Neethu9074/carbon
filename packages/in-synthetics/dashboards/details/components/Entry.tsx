/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment, useState } from 'react';

import { toInteractiveElement } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { bytesZeroDecimalPlaces, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import KeyValueHeader from 'in-synthetics/dashboards/details/components/KeyValueHeader';
import ToggleIcon from 'in-synthetics/dashboards/details/components/ToggleIcon';
import Timings from 'in-synthetics/dashboards/details/components/Timings';
import { getType, types } from 'in-synthetics/utils/browserFileTypes';
import { TestResultEntry } from 'in-synthetics/utils/constants';
import { Row, Col } from 'in-components/layout/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Pill from 'in-components/Pill';

import locals from './Subtransaction.mless';

type EntryProps = {
  entry: TestResultEntry;
};

export default function Entry({ entry }: EntryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={locals.subtransaction}>
      <Tooltip
        content={
          expanded
            ? t('in-synthetics:dashboard.detailsPage.showLessSubDetails')
            : t('in-synthetics:dashboard.detailsPage.showMoreSubDetails')
        }
        align="topMiddle"
      >
        <div
          className={locals.header}
          {...toInteractiveElement({
            ariaLabel: expanded
              ? t('in-synthetics:dashboard.detailsPage.showLessSubDetails')
              : t('in-synthetics:dashboard.detailsPage.showMoreSubDetails'),
            onDefaultInteraction: () => setExpanded(!expanded)
          })}
        >
          <div className={locals.leftHeader}>
            <TypeHeader entry={entry} />
            <LeftHeader entry={entry} />
          </div>
          <div className={locals.rightHeader}>
            <ToggleIcon expanded={expanded} />
          </div>
        </div>
      </Tooltip>
      {expanded && (
        <div className={locals.body}>
          <EntryBody entry={entry} />
        </div>
      )}
    </div>
  );
}

function TypeHeader({ entry }: EntryProps) {
  const mimeType: string = entry.response.content.mimeType.split('/')[1];
  const type = getType(mimeType != undefined ? mimeType : 'x-unknown');
  // @ts-expect-error
  const typeDefinition = types[type];
  return (
    <Tooltip content={typeDefinition.long} align="rightMiddle">
      <Pill color={typeDefinition.color} className={locals.type}>
        {typeDefinition.short}
      </Pill>
    </Tooltip>
  );
}

function LeftHeader({ entry }: EntryProps) {
  return (
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
        value={`${bytesZeroDecimalPlaces(entry.response.headersSize + entry.response.bodySize)}`}
      />
      <KeyValueHeader
        label={t('in-synthetics:dashboard.detailsPage.browserDetails.entry.time')}
        value={`${millisToTwoDecimalSeconds(entry.time)}`}
      />
    </Fragment>
  );
}

function EntryBody({ entry }: EntryProps) {
  const { blocked, dns, connect, ssl, send, wait, receive } = entry.timings;

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
          <h2 className={locals.bodyHeader}>
            {t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.title')}
          </h2>
          <Dl>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.url')}>
              <a href={entry.request.url} rel="noopener noreferrer" target="_blank">
                {entry.request.url || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
              </a>
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.httpVersion')}>
              {entry.request.httpVersion}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.method')}>
              {entry.request.method}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.headerSize')}>
              {bytesZeroDecimalPlaces(entry.request.headersSize)}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.request.bodySize')}>
              {bytesZeroDecimalPlaces(entry.request.bodySize)}
            </Di>
          </Dl>
        </Col>
        <Col lg={4}>
          <h2 className={locals.bodyHeader}>
            {t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.title')}
          </h2>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.redirectUrl')}>
            <a href={entry.response.redirectURL} rel="noopener noreferrer" target="_blank">
              {entry.response.redirectURL || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
            </a>
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.httpVersion')}>
            {entry.response.httpVersion}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.status')}>
            {`${entry.response.status} ${entry.response.statusText}`}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.transferSize')}>
            {bytesZeroDecimalPlaces(entry.response._transferSize)}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.headerSize')}>
            {bytesZeroDecimalPlaces(entry.response.headersSize)}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.bodySize')}>
            {bytesZeroDecimalPlaces(entry.response.bodySize)}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.contentType')}>
            {entry.response.content.mimeType}
          </Di>
          <Di title={t('in-synthetics:dashboard.detailsPage.browserDetails.body.response.contentSize')}>
            {bytesZeroDecimalPlaces(entry.response.content.size)}
          </Di>
        </Col>
        <Col lg={4}>
          <h2 className={locals.bodyHeader}>
            {t('in-synthetics:dashboard.detailsPage.browserDetails.body.timings.title')}
          </h2>
          <Timings timings={timings} duration={entry.time} />
        </Col>
      </Row>
    </Fragment>
  );
}

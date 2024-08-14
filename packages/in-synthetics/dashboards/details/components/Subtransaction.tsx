/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment, useState } from 'react';

import { KeyValueProps, toInteractiveElement, Pill } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  bytesPerSecondZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  millis,
  millisToTwoDecimalSeconds
} from 'in-services/formatters/number';
import { OverviewChartToolTipProps as SubtransactionProps } from 'in-synthetics/utils/constants';
import { Di, Dl } from 'in-components/HorizontalDescriptionList/HorizontalDescriptionList';
import ToggleIcon from 'in-synthetics/dashboards/details/components/ToggleIcon';
import Timings from 'in-synthetics/dashboards/details/components/Timings';
import { Row, Col } from 'in-components/layout/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './Subtransaction.mless';

export default function Subtransaction({ subtransaction }: SubtransactionProps) {
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
        overwriteBlock
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
            <TypeHeader subtransaction={subtransaction} />
            <LeftHeader subtransaction={subtransaction} />
          </div>
          <div className={locals.rightHeader}>
            <ToggleIcon expanded={expanded} />
          </div>
        </div>
      </Tooltip>
      {expanded && (
        <div className={locals.body}>
          <SubtransactionBody subtransaction={subtransaction} />
        </div>
      )}
    </div>
  );
}

function TypeHeader({ subtransaction }: SubtransactionProps) {
  return (
    <Tooltip content={''} align="rightMiddle">
      <Pill type={'gray'} className={locals.type}>
        {subtransaction.metrics.httpOperation}
      </Pill>
    </Tooltip>
  );
}

function LeftHeader({ subtransaction }: SubtransactionProps) {
  const { statusCode, responseSize, responseTime, uri } = subtransaction.metrics;
  return (
    <Fragment>
      <KeyValueHeader label={uri || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')} value={''} />
      <KeyValueHeader label={t('in-synthetics:dashboard.detailsPage.subtransactionStatus')} value={statusCode} />
      <KeyValueHeader
        label={t('in-synthetics:dashboard.detailsPage.subtransactionSize')}
        value={`${bytesZeroDecimalPlaces(responseSize)}`}
      />
      <KeyValueHeader
        label={t('in-synthetics:dashboard.detailsPage.subtransactionTime')}
        value={`${millisToTwoDecimalSeconds(responseTime)}`}
      />
    </Fragment>
  );
}

function KeyValueHeader({ label, value }: KeyValueProps) {
  return (
    <Tooltip content={label} align="leftMiddle">
      <div className={locals.subHeader}>
        <span className={locals.key}>{label}</span>
        <span className={locals.value}>{value}</span>
      </div>
    </Tooltip>
  );
}

function SubtransactionBody({ subtransaction }: SubtransactionProps) {
  const {
    uri,
    contentType,
    responseSize,
    redirectTime,
    uploadSpeed,
    downloadSpeed,
    blocking,
    dns,
    connect,
    ssl,
    sending,
    waiting,
    receiving,
    responseTime
  } = subtransaction.metrics;

  const timings = [
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionBlocking'),
      value: blocking
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionDNS'),
      value: dns
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionConnect'),
      value: connect
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionSSL'),
      value: ssl
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionSending'),
      value: sending
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionWaiting'),
      value: waiting
    },
    {
      label: t('in-synthetics:dashboard.detailsPage.subtransactionReceiving'),
      value: receiving
    }
  ];

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <h2 className={locals.bodyHeader}>
            {t('in-synthetics:dashboard.detailsPage.subtransactionBody.requestTitle')}
          </h2>
          <Dl>
            <Di title={'Url'}>
              <a href={uri} rel="noopener noreferrer" target="_blank">
                {uri || t('in-synthetics:dashboard.detailsPage.noDataAvailable.notFound')}
              </a>
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.subtransactionBody.contentType')}>{contentType}</Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.subtransactionBody.size')}>
              {bytesZeroDecimalPlaces(responseSize)}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.subtransactionBody.redirectTime')}>
              {millis.compact(redirectTime)}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.subtransactionBody.uploadSpeed')}>
              {bytesPerSecondZeroDecimalPlaces(uploadSpeed)}
            </Di>
            <Di title={t('in-synthetics:dashboard.detailsPage.subtransactionBody.downloadSpeed')}>
              {bytesPerSecondZeroDecimalPlaces(downloadSpeed)}
            </Di>
          </Dl>
        </Col>
        <Col lg={6}>
          <h2 className={locals.bodyHeader}>
            {t('in-synthetics:dashboard.detailsPage.subtransactionBody.responseTimingTitle')}
          </h2>
          <Timings timings={timings} duration={responseTime} />
        </Col>
      </Row>
    </Fragment>
  );
}

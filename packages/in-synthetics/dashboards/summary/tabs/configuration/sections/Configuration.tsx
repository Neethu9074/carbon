/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  SyntheticTest,
  HttpActionConfiguration,
  HttpScriptConfiguration,
  SyntheticTypeConfigurationUnion,
  SSLCertificateConfiguration,
  BrowserScriptConfiguration,
  WebpageActionConfiguration,
  WebpageScriptConfiguration,
  DNSConfiguration
} from '@instana/types';
import { Card, KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import { DNSAdditionalProperties } from 'in-synthetics/dashboards/summary/tabs/configuration/sections/DNSAdditionalProperties';
import { DNSAssertions } from 'in-synthetics/dashboards/summary/tabs/configuration/sections/DNSAssertions';
import { SSLAssertions } from 'in-synthetics/dashboards/summary/tabs/configuration/sections/SSLAssertions';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { syntheticSslImprovementEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import CodeInput from 'in-synthetics/packages/Code/CodeInput';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import CodeComponent from 'in-components/Code';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const renderHeaders = (headers: any) => {
  let content = [];
  if (Object.entries(headers).length > 0) {
    for (const key in headers) {
      content.push(
        <Row key={key} className={locals.configRow}>
          <Col xs={3}>
            <KeyValue label={t('in-synthetics:dashboard.configuration.header')} value={key} />
          </Col>
          <Col xs={3}>
            <KeyValue label={t('in-synthetics:dashboard.configuration.value')} value={headers[key]} />
          </Col>
        </Row>
      );
    }
  }
  return content;
};

const showTimeoutAndRetryOptions = (configuration: SyntheticTypeConfigurationUnion) => {
  const timeoutUnit: Record<string, string> = { m: 'minutes', s: 'seconds', ms: 'milliseconds' };
  const content = [
    configuration.timeout && (
      <Row key={'timeout'} className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.timeoutLabel')}
            value={t('in-synthetics:dashboard.configuration.timeoutDescription', {
              timeoutValue: configuration.timeout.replace(/[^0-9]/g, ''),
              timeoutUnit: timeoutUnit[configuration.timeout.replace(/[0-9]/g, '')]
            })}
          />
        </Col>
      </Row>
    ),
    configuration.retries! >= 0 && (
      <Row key={'retryStrategy'} className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.retryStrategyLabel')}
            value={
              configuration.retries === 0
                ? t('in-synthetics:dashboard.configuration.retryStrategyNone')
                : t('in-synthetics:dashboard.configuration.retryStrategyDescription', {
                    retryStrategy: configuration.retries === 1 ? 'once' : 'twice'
                  })
            }
          />
        </Col>
        {configuration.retryInterval && configuration.retries! >= 1 && (
          <Col xs={3}>
            <KeyValue
              label={t('in-synthetics:dashboard.configuration.retryIntervalFieldLabel')}
              value={
                configuration.retryInterval > 1
                  ? t('in-synthetics:dashboard.configuration.retryIntervalSecondsDescription', {
                      retryIntervalValue: configuration.retryInterval
                    })
                  : t('in-synthetics:dashboard.configuration.retryIntervalSecondDescription', {
                      retryIntervalValue: configuration.retryInterval
                    })
              }
            />
          </Col>
        )}
      </Row>
    )
  ];
  return content;
};

const showAdditionalOptions = (configuration: SyntheticTypeConfigurationUnion) => {
  const content = [];
  if (configuration.syntheticType === 'HTTPAction') {
    if (configuration.allowInsecure)
      content.push(
        <Row key={'allowInsecure'} className={locals.additionalOptionsRow}>
          {t('in-synthetics:dashboard.configuration.followRedirect')}
        </Row>
      );

    if (configuration.followRedirect)
      content.push(
        <Row key={'followRedirect'} className={locals.additionalOptionsRow}>
          {t('in-synthetics:dashboard.configuration.allowInsecure')}
        </Row>
      );
  }

  if (configuration.markSyntheticCall)
    content.push(
      <Row key={'markSyntheticCall'} className={locals.additionalOptionsRow}>
        {t('in-synthetics:dashboard.configuration.markSyntheticCall')}
      </Row>
    );

  if (
    ['BrowserScript', 'WebpageAction', 'WebpageScript'].includes(configuration.syntheticType) &&
    (configuration as BrowserScriptConfiguration | WebpageActionConfiguration | WebpageScriptConfiguration).recordVideo
  ) {
    content.push(
      <Row key={'recordVideo'} className={locals.additionalOptionsRow}>
        {t('in-synthetics:dashboard.configuration.recordVideo')}
      </Row>
    );
  }

  return content;
};

const renderSimpleTestTypeContent = (configuration: HttpActionConfiguration) => {
  const content = [
    <Row key={'operation'} className={locals.configRow}>
      <Col xs={3}>
        <KeyValue label={t('in-synthetics:dashboard.configuration.operation')} value={configuration.operation} />
      </Col>
      <Col xs={9}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.url')}
          value={
            <Tooltip content={configuration.url}>
              <div className={locals.urlConfig}>{configuration.url}</div>
            </Tooltip>
          }
        />
      </Col>
    </Row>,
    configuration.headers && renderHeaders(configuration.headers),
    configuration.body && (
      <Row key={'body'} className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.body')} value={configuration.body} />
        </Col>
      </Row>
    ),
    configuration.validationString && (
      <Row key={'validationString'} className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.validationString')}
            value={configuration.validationString}
          />
        </Col>
      </Row>
    ),
    configuration.expectStatus && (
      <Row key={'expectStatus'} className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.expectStatus')}
            value={configuration.expectStatus}
          />
        </Col>
      </Row>
    ),
    configuration.expectMatch && (
      <Row key={'expectMatch'} className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.expectMatch')} value={configuration.expectMatch} />
        </Col>
      </Row>
    ),
    configuration.expectJson && (
      <Row key={'expectJSON'} className={locals.configRow}>
        <Col xs={12}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.expectJSON')}
            value={
              <CodeComponent
                wrapperClassName={locals.code}
                code={JSON.stringify(configuration.expectJson, undefined, 2)}
                lang="json"
                showLineNumbers={false}
                withoutCopyButton
                withExpandButton
                softWrap
              />
            }
          />
        </Col>
      </Row>
    ),
    showTimeoutAndRetryOptions(configuration),
    <Row key={'additionalOptions'}>
      <LightCard
        className={locals.lastConfigRow}
        title={t('in-synthetics:dashboard.configuration.additionalOptionsTitle')}
        darkFrame
        useMaxAvailableHeight
      >
        {showAdditionalOptions(configuration)}
      </LightCard>
    </Row>
  ];
  return content;
};

const renderScriptTestTypeContent = (configuration: HttpScriptConfiguration) => {
  return (
    <>
      <Row key={'configScript'}>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.configScriptTitle')}
          darkFrame
          framed
        >
          {configuration.script != undefined ? (
            <CodeInput value={configuration.script} height="30vh" readOnly />
          ) : configuration.scripts ? (
            <KeyValue
              label={t('in-synthetics:dashboard.configuration.configScriptFileName')}
              value={configuration.scripts.scriptFile}
            />
          ) : (
            t('in-synthetics:dashboard.configuration.noScriptFileFound')
          )}
        </LightCard>
      </Row>
      {showTimeoutAndRetryOptions(configuration)}
      <Row key={'additionalOptions'}>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.additionalOptionsTitle')}
          darkFrame
          useMaxAvailableHeight
        >
          {showAdditionalOptions(configuration)}
        </LightCard>
      </Row>
    </>
  );
};

const renderWebpageActionTestTypeContent = (configuration: HttpActionConfiguration) => {
  return (
    <>
      <Row key={'webpageActionURL'}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.webpageActionUrl')} value={configuration.url} />
        </Col>
      </Row>
      {showTimeoutAndRetryOptions(configuration)}
      <Row key={'additionalOptions'}>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.additionalOptionsTitle')}
          darkFrame
          useMaxAvailableHeight
        >
          {showAdditionalOptions(configuration)}
        </LightCard>
      </Row>
    </>
  );
};

const renderSSLCertificateTestTypeContent = (configuration: SSLCertificateConfiguration) => {
  const daysRemainingCheck = configuration.daysRemainingCheck;
  const isZeroOrOneDayRemaining: boolean = [0, 1].includes(daysRemainingCheck);
  const daysOrDayRemainingLabel: string = isZeroOrOneDayRemaining
    ? t('in-synthetics:dashboard.configuration.day', { daysRemainingCheck })
    : t('in-synthetics:dashboard.configuration.days', { daysRemainingCheck });
  const content = [
    <Row key={'hostname'} className={locals.configRow}>
      <Col xs={4}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.hostname')}
          value={
            <Tooltip content={configuration.hostname}>
              <div className={locals.urlConfig}>{configuration.hostname}</div>
            </Tooltip>
          }
        />
      </Col>
      <Col xs={2}>
        <KeyValue label={t('in-synthetics:dashboard.configuration.port')} value={configuration.port} />
      </Col>
    </Row>,
    <Row key={'daysRemaining'} className={locals.configRow}>
      <Col xs={12}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.daysRemaining')}
          value={`${daysOrDayRemainingLabel}`}
        />
      </Col>
    </Row>,
    showTimeoutAndRetryOptions(configuration),
    syntheticSslImprovementEnabled && configuration.validationRules && configuration.validationRules?.length > 0 && (
      <Row key={'assertions'} className={locals.configRow}>
        <SSLAssertions assertions={configuration.validationRules} />
      </Row>
    )
  ];
  if (configuration.acceptSelfSignedCertificate) {
    content.push(
      <Row key={'additionalOptions'}>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.additionalOptionsTitle')}
          darkFrame
          useMaxAvailableHeight
        >
          <Row key={'acceptSelfSignedCertificate'} className={locals.additionalOptionsRow}>
            {t('in-synthetics:dashboard.configuration.acceptSelfSignedCertificate')}
          </Row>
        </LightCard>
      </Row>
    );
  }
  return content;
};

const renderDNSTestTypeContent = (configuration: DNSConfiguration) => {
  const content = [
    <Row key={'dnsLookup'}>
      <Col xs={3}>
        <KeyValue label={t('in-synthetics:dashboard.configuration.dns.lookupLabel')} value={configuration.lookup} />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.dns.queryTypeLabel')}
          value={configuration.queryType}
        />
      </Col>
    </Row>,
    <Row key={'server'} className={locals.configRow}>
      <Col xs={3}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.dns.serverLabel')}
          value={<div className={locals.urlConfig}>{configuration.server}</div>}
        />
      </Col>
      <Col xs={3}>
        <KeyValue label={t('in-synthetics:dashboard.configuration.dns.portLabel')} value={configuration.port} />
      </Col>
    </Row>,
    <Row key={'responseTime'} className={locals.configRow}>
      <Col xs={3}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.dns.responseTimeLabel')}
          value={t('in-synthetics:dashboard.configuration.dns.responseTimeDescription', {
            responseTime: configuration.queryTime?.value
          })}
        />
      </Col>
    </Row>,
    configuration.targetValues && configuration.targetValues?.length > 0 && (
      <Row key={'assertions'} className={locals.configRow}>
        <DNSAssertions assertions={configuration.targetValues} />
      </Row>
    ),
    <Row key={'moreProperties'} className={locals.configRow}>
      <DNSAdditionalProperties configuration={configuration} />
    </Row>,
    showTimeoutAndRetryOptions(configuration),
    <Row key={'additionalOptions'}>
      <LightCard
        className={locals.lastConfigRow}
        title={t('in-synthetics:dashboard.configuration.additionalOptionsTitle')}
        darkFrame
        useMaxAvailableHeight
      >
        {showAdditionalOptions(configuration)}
      </LightCard>
    </Row>
  ];
  return content;
};

const ConfigSection = ({ test }: Props) => {
  const { configuration } = test;
  let content = null;
  switch (test.configuration.syntheticType) {
    case 'HTTPAction':
      content = renderSimpleTestTypeContent(configuration as HttpActionConfiguration);
      break;
    case 'WebpageAction':
      content = renderWebpageActionTestTypeContent(configuration as HttpActionConfiguration);
      break;
    case 'SSLCertificate':
      content = renderSSLCertificateTestTypeContent(configuration as SSLCertificateConfiguration);
      break;
    case 'HTTPScript':
    case 'BrowserScript':
    case 'WebpageScript':
      content = renderScriptTestTypeContent(configuration as HttpScriptConfiguration);
      break;
    case 'DNS':
      content = renderDNSTestTypeContent(configuration as DNSConfiguration);
      break;
    default:
      content = (
        <Card>
          <NoDataAvailable
            type="lib_synthetic"
            height={160}
            text={t('in-synthetics:dashboard.noDataAvailable.configurationTab', { component: 'Configuration' })}
          />
        </Card>
      );
  }

  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.configSectionTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      {content}
    </ExpandableLightCard>
  );
};

export default ConfigSection;

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticTest, HttpActionConfiguration, HttpScriptConfiguration } from '@instana/types';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Code from 'in-synthetics/packages/Code/Code';
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

const showAdditionalOptions = (configuration: HttpActionConfiguration) => {
  const content = [];
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
    <Row key={'configScript'}>
      <LightCard
        className={locals.lastConfigRow}
        title={t('in-synthetics:dashboard.configuration.configScriptTitle')}
        darkFrame
        framed
      >
        {configuration.script != undefined ? (
          <Code value={configuration.script} height="30vh" readOnly />
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
  );
};

const renderWebpageActionTestTypeContent = (configuration: HttpActionConfiguration) => {
  return (
    <Row key={'webpageActionURL'}>
      <Col xs={3}>
        <KeyValue label={t('in-synthetics:dashboard.configuration.webpageActionUrl')} value={configuration.url} />
      </Col>
    </Row>
  );
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
    default:
      content = renderScriptTestTypeContent(configuration as HttpScriptConfiguration);
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

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticTest, SyntheticTypeConfigurationUnion } from '@instana/types';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';
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

const showAdditionalOptions = (configuration: SyntheticTypeConfigurationUnion) => {
  const content = [];
  //@ts-expect-error
  if (configuration.allowInsecure)
    content.push(
      <Row key={'allowInsecure'} className={locals.additionalOptionsRow}>
        {t('in-synthetics:dashboard.configuration.followRedirect')}
      </Row>
    );

  //@ts-expect-error
  if (configuration.followRedirect)
    content.push(
      <Row key={'followRedirect'} className={locals.additionalOptionsRow}>
        {t('in-synthetics:dashboard.configuration.allowInsecure')}
      </Row>
    );

  return content;
};

const renderSimpleTestTypeContent = (configuration: SyntheticTypeConfigurationUnion) => {
  const content = [
    <Row className={locals.configRow}>
      <Col xs={3}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.operation')}
          value={
            //@ts-expect-error
            configuration.operation
          }
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={t('in-synthetics:dashboard.configuration.url')}
          value={
            //@ts-expect-error
            configuration.url
          }
        />
      </Col>
    </Row>,
    //@ts-expect-error
    configuration.headers && renderHeaders(configuration.headers),
    //@ts-expect-error
    configuration.body && (
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.body')}
            value={
              //@ts-expect-error
              configuration.body
            }
          />
        </Col>
      </Row>
    ),
    //@ts-expect-error
    configuration.validationString && (
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.validationString')}
            value={
              //@ts-expect-error
              configuration.validationString
            }
          />
        </Col>
      </Row>
    ),
    //@ts-expect-error
    configuration.expectStatus && (
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.expectStatus')}
            value={
              //@ts-expect-error
              configuration.expectStatus
            }
          />
        </Col>
      </Row>
    ),
    //@ts-expect-error
    configuration.expectMatch && (
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.expectMatch')}
            value={
              //@ts-expect-error
              configuration.expectMatch
            }
          />
        </Col>
      </Row>
    ),
    //@ts-expect-error
    configuration.expectJson && (
      <Row className={locals.configRow}>
        <Col xs={12}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.expectJSON')}
            value={
              <CodeComponent
                wrapperClassName={locals.code}
                code={
                  //@ts-expect-error
                  JSON.stringify(configuration.expectJson, undefined, 2)
                }
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
    <Row>
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

const renderScriptTestTypeContent = (configuration: SyntheticTypeConfigurationUnion) => {
  return (
    <Row>
      <LightCard
        className={locals.lastConfigRow}
        title={t('in-synthetics:dashboard.configuration.configScriptTitle')}
        darkFrame
        framed
      >
        {
          //@ts-expect-error
          configuration.script != undefined ? (
            <CodeComponent
              wrapperClassName={locals.code}
              code={
                //@ts-expect-error
                JSON.stringify(configuration.script, undefined, 2)
              }
              lang="json"
              showLineNumbers={false}
              withoutCopyButton
              withExpandButton
              softWrap
            />
          ) : //@ts-expect-error
          configuration.scripts ? (
            <KeyValue
              label={t('in-synthetics:dashboard.configuration.configScriptFileName')}
              value={
                //@ts-expect-error
                configuration.scripts.scriptFile
              }
            />
          ) : (
            t('in-synthetics:dashboard.configuration.noScriptFileFound')
          )
        }
      </LightCard>
    </Row>
  );
};

const ConfigSection = ({ test }: Props) => {
  const { configuration } = test;
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.configSectionTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      {test.configuration.syntheticType === 'HTTPAction'
        ? renderSimpleTestTypeContent(configuration)
        : renderScriptTestTypeContent(configuration)}
    </ExpandableLightCard>
  );
};

export default ConfigSection;

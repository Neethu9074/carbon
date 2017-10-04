import React from 'react';

import SectionLine from 'in-views/configurationView/subview/DynamicRule/components/SectionLine';
import RuleControl from 'in-views/configurationView/subview/DynamicRule/components/RuleControl';
import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import Step from 'in-views/configurationView/subview/DynamicRule/components/Step';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import { getSingular } from 'in-sdk/pluginName';
import { Row, Col } from 'in-components/Grid';
import { getCategories } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Step1.less';

const block = 'in-dynamic-rule-dialog-step-1';
const allowedPlugins = [
  'batchServiceInstance',
  'browserLogicalConnection',
  'browserLogicalService',
  'cassandraKeyspaceServiceInstance',
  'databaseServiceInstance',
  'ejbLogicalConnection',
  'ejbLogicalService',
  'ejbServiceInstance',
  'elasticSearchIndexServiceInstance',
  'ftpServiceInstance',
  'javaMailLogicalConnection',
  'javaMailLogicalService',
  'javaMailServiceInstance',
  'ldapLogicalConnection',
  'ldapLogicalService',
  'ldapServiceInstance',
  'logicalBatch',
  'logicalBatchConnection',
  'logicalCassandraConnection',
  'logicalCassandraKeyspace',
  'logicalDatabase',
  'logicalDatabaseConnection',
  'logicalEjbConnection',
  'logicalElasticSearchConnection',
  'logicalElasticSearchIndex',
  'logicalFtpConnection',
  'logicalFtpService',
  'logicalHttpConnection',
  'logicalJdbcConnection',
  'logicalKafkaConsumerConnection',
  'logicalKafkaPublisherConnection',
  'logicalMessageBroker',
  'logicalMessageConsumer',
  'logicalMessageConsumerConnection',
  'logicalMessagePublisherConnection',
  'logicalMongoDbConnection',
  'logicalMongoDbDatabase',
  'logicalPdoConnection',
  'logicalRabbitMqConsumerConnection',
  'logicalRabbitMqPublisherConnection',
  'logicalRedisConnection',
  'logicalRedisDatabase',
  'logicalRpcConnection',
  'logicalRpcEndpoint',
  'logicalWebApp',
  'messageBrokerServiceInstance',
  'messageConsumerServiceInstance',
  'mongoDbDatabaseServiceInstance',
  'pageResourceLogicalConnection',
  'pageResourceLogicalService',
  'pageResourceLogicalService',
  'pageResourceServiceInstance',
  'redisServiceInstance',
  'rpcEndpointServiceInstance',
  'sdkLogicalConnection',
  'sdkLogicalService',
  'sdkServiceInstance',
  'shellLogicalConnection',
  'shellLogicalService',
  'webAppServiceInstance'
];
const pluginsWithMetricDefinitions = allowedPlugins
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));

export default function Step1({ form, onChange }) {
  return (
    <Step number={1} title="Entities & Metrics" form={form} onChange={onChange}>
      <RuleControl name="Entity type and metric">
        <Row>
          <Col cols={6}>
            {form.get('entityType').map(field => (
              <FormGroup className={`${block}__select`}>
                <Label htmlFor="rule-entityType" hasError={!field.valid}>
                  Entity type
                </Label>
                <ComboBox
                  name="rule-entityType"
                  value={field.value}
                  options={[{ value: '', label: 'Please select' }].concat(
                    pluginsWithMetricDefinitions.map(plugin => {
                      return {
                        value: plugin,
                        label: getSingular(plugin)
                      };
                    })
                  )}
                  onChange={e => onChange(['entityType', 'metricName'], [e ? e.value : '-1', '-1'])}
                />
                {field.messages.map((message, i) => (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                ))}
              </FormGroup>
            ))}
          </Col>
          <Col cols={6}>
            {form.get('metricName').map(field => (
              <FormGroup className={`${block}__select`}>
                <Label htmlFor="rule-metricName" hasError={!field.valid}>
                  Metric
                </Label>
                {form.get('entityType').value ? (
                  <MetricSelector
                    id="rule-metricName"
                    plugin={form.get('entityType').value}
                    value={form.get('metricName').value}
                    useComboBox
                    onChange={e => onChange('metricName', e ? e.value : '')}
                  />
                ) : (
                  <ComboBox options={[]} />
                )}
                {field.messages.map((message, i) => (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                ))}
              </FormGroup>
            ))}
          </Col>
        </Row>
      </RuleControl>

      <SectionLine />

      <RuleControl name="Entities matched" helpComponent={MatchingEntitiesHelpBox}>
        {form.get('query').map(field => (
          <FormGroup>
            <div className={`${block}__filter-label-wrapper`}>
              <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid}>
                Filter query
              </Label>
              <TooltipIcon tooltip="A filter query which defines for which entities the rule shall be applied. If no filter is defined it will be applied on all available entities." />
            </div>
            <Input
              id="rule-query"
              type="text"
              className={`${block}__helpfified_input`}
              value={field.value}
              onChange={e => onChange('query', e.target.value)}
              hasError={!field.valid}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
            <MatchingEntities />
          </FormGroup>
        ))}
      </RuleControl>
    </Step>
  );
}

function MatchingEntitiesHelpBox() {
  return (
    <div className={`${block}__matching-entities-help-box`}>
      <span className={`${block}__matching-entities-help-box-beta`}>beta</span>
      <br />
      <br />
      <span>This feature is currently in testing phase. </span>
      <br />
      <br />
      <span>
        The number of entities that can be monitored is limited to 20. Please narrow down the entities by adding a
        filter query.
      </span>
    </div>
  );
}

function MatchingEntities() {
  return <div className={`${block}__matching-entities`} />;
}

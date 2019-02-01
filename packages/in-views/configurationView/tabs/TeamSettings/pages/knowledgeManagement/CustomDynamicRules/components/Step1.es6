import React from 'react';

import MatchingEntityTable from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/MatchingEntityTable';
import TooltipIcon from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/TooltipIcon';
import MetricSelector from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomRules/components/MetricSelector';
import Spacer from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/Spacer';
import { applicationPlugins, defaultAndUnknownPluginNames, oneZeroLogicalPlugins } from 'in-forge/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import RuleControl from 'in-components/form/RuleControl';
import FormGroup from 'in-components/form/FormGroup';
import { getSingular } from 'in-sdk/pluginName';
import { getCategories } from 'in-sdk/metrics';
import { Row, Col } from 'in-components/Grid';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Step from 'in-components/form/Step';

import './Step1.less';

const block = 'in-dynamic-rule-dialog-step-1';

const plugins = twoZeroModeEnabled ? applicationPlugins : oneZeroLogicalPlugins;
const pluginsWithMetricDefinitions = Object.keys(plugins)
  .map(key => plugins[key])
  .filter(plugin => defaultAndUnknownPluginNames.indexOf(plugin) < 0)
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));

export default function Step1({ form, onChange, excludeEntity, includeEntity }) {
  return (
    <Step number={1} title="Entities & Metrics" form={form} onChange={onChange}>
      <RuleControl name="Type and metric">
        <Row>
          <Col cols={6}>
            {form.get('entityType').map(field => (
              <FormGroup className={`${block}__select`}>
                <Label htmlFor="rule-entityType" hasError={!field.valid && field.touched}>
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
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          <Col cols={6}>
            {form.get('metricName').map(field => (
              <FormGroup className={`${block}__select`}>
                <Label htmlFor="rule-metricName" hasError={!field.valid && field.touched}>
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
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>
      </RuleControl>

      <Spacer />

      <RuleControl name="Entities the rule will be applied on." helpComponent={MatchingEntitiesHelpBox} form={form}>
        {form.get('query').map(field => (
          <FormGroup>
            <div className={`${block}__filter-label-wrapper`}>
              <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid && field.touched}>
                Filter query
              </Label>
              <TooltipIcon tooltip="Apply a filter query to narrow down the number of entities the rule shall be applied on. If no filter query is given, it will be applied on all entities." />
            </div>
            <Input
              id="rule-query"
              type="text"
              placeholder="e.g: entity.zone:prod"
              className={`${block}__helpfified_input`}
              value={field.value}
              onChange={e => onChange('query', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            {form.get('matchingEntities').map((field, i) => (
              <TouchedMessages key={i} field={field} />
            ))}
            <TouchedMessages field={field} />
            <MatchingEntityTable form={form} excludeEntity={excludeEntity} includeEntity={includeEntity} />
            <MatchingEntitiesIndicator form={form} />
          </FormGroup>
        ))}
      </RuleControl>
    </Step>
  );
}

function MatchingEntitiesIndicator({ form }) {
  return (
    <div className={`${block}__matching-entities-indicator`}>
      {form.get('selectedEntities').map(field => {
        const selectedEntities = field.value;
        return (
          <span>
            {selectedEntities.length} {selectedEntities.length === 1 ? 'Entity' : 'Entities'} selected
          </span>
        );
      })}
      {form.get('selectedEntities').map(field => {
        return field.messages.map((message, i) => <TouchedMessages key={i} field={field} />);
      })}
    </div>
  );
}

function MatchingEntitiesHelpBox({ form }) {
  return form.get('selectedEntities').map(field => {
    const selectedEntities = field.value;
    if (selectedEntities.length <= 10) {
      return null;
    }
    return (
      <div className={`${block}__matching-entities-help-box`}>
        <span className={`${block}__matching-entities-help-box-beta`}>beta</span>
        <br />
        <br />
        <span>
          The number of entities that can be monitored by a dynamic rule is limited to{' '}
          <span className={`${block}__num-entities-during-beta`}>10</span> during the beta. Please narrow down the
          entities by adding a filter query and/or excluding entities.
        </span>
      </div>
    );
  });
}

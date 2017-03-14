import React from 'react';

import MetricSelector from 'in-views/configurationView/subview/Rule/MetricSelector';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import {getSingular} from 'in-sdk/pluginName';
import {getCategories} from 'in-sdk/metrics';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {Row, Col} from 'in-components/Grid';
import {plugins} from 'in-forge/constants';


const furtherPluginsToFilter = [
  'unknownService',
  'defaultLogicalService',
  'defaultServiceInstance',
  'defaultLogicalConnection'
];
const pluginsWithMetricDefinitions = Object.keys(plugins)
  .map(key => plugins[key])
  .filter(plugin => furtherPluginsToFilter.indexOf(plugin) < 0)
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));

export default function RuleForm({form, onChange}) {
  return (
    <fieldset>
      <Section>
        {form.get('name').map(field =>
          <FormGroup>
            <Label htmlFor='rule-name'
                   hasError={!field.valid}>
              Name
            </Label>
            <Input id='rule-name'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('name', e.target.value)}
                   hasError={!field.valid}
                   autoFocus />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              Rules can be selected by name in the rule binding dialog.
            </HelpBlock>
          </FormGroup>
        )}
      </Section>

      <Section>
        {form.get('entityType').map(field =>
          <FormGroup>
            <Label htmlFor='rule-entityType'
                   hasError={!field.valid}>
              Entity type
            </Label>
            <ComboBox name='rule-entityType'
                      value={field.value}
                      options={[{ value: '', label: 'Please select' }].concat(
                        pluginsWithMetricDefinitions.map(plugin => {
                          return {
                            value: plugin,
                            label: getSingular(plugin)
                          };
                        })
                      )}
                      onChange={e => onChange(['entityType', 'metricName'], [e ? e.value : '-1', '-1'])} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

        <Row>
          <Col cols={4}>
            {form.get('entityType').value ?
              form.get('metricName').map(field =>
                <FormGroup>
                  <Label htmlFor='rule-metricName'
                         hasError={!field.valid}>
                    Metric
                  </Label>
                  <MetricSelector id='rule-metricName'
                                  plugin={form.get('entityType').value}
                                  value={form.get('metricName').value}
                                  useComboBox
                                  onChange={e => onChange('metricName', e ? e.value : '')} />
                  {field.messages.map((message, i) =>
                    <ValidationBlock hasError
                                     key={i}>
                      {message.message}
                    </ValidationBlock>
                  )}
                </FormGroup>
              )
            : null}
          </Col>
          <Col cols={2}>
            {form.get('window').map(field =>
              <FormGroup>
                <Label htmlFor='rule-window'
                       hasError={!field.valid}>
                  Time window
                </Label>
                <ComboBox name='rule-window'
                          value={field.value}
                          options={[
                            { value: '', label: 'Please select' },
                            { value: '1000', label: '1s' },
                            { value: '5000', label: '5s' },
                            { value: '10000', label: '10s' },
                            { value: '60000', label: '1min' },
                            { value: '300000', label: '5min' },
                            { value: '600000', label: '10min' }
                          ]}
                          onChange={e => onChange('window', e ? e.value : '')} />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}
          </Col>
          <Col cols={2}>
            {form.get('aggregation').map(field =>
              <FormGroup>
                <Label htmlFor='rule-aggregation'
                       hasError={!field.valid}>
                  Aggregation
                </Label>
                <ComboBox name='rule-aggregation'
                          value={field.value}
                          options={[
                            { value: '', label: 'Please select' },
                            { value: 'avg', label: 'avg' },
                            { value: 'sum', label: 'sum' }
                          ]}
                          onChange={e => onChange('aggregation', e ? e.value : e)} />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}
          </Col>
          <Col cols={2}>
            {form.get('conditionOperator').map(field =>
              <FormGroup>
                <Label htmlFor='rule-conditionOperator'
                       hasError={!field.valid}>
                  Operator
                </Label>
                <ComboBox name='rule-conditionOperator'
                          value={field.value}
                          options={[
                            { value: '', label: 'Please select' },
                            { value: '<', label: '<' },
                            { value: '<=', label: '<=' },
                            { value: '==', label: '==' },
                            { value: '>=', label: '>=' },
                            { value: '>', label: '>' },
                            { value: '!=', label: '!=' }
                          ]}
                          onChange={e => onChange('conditionOperator', e ? e.value : e)} />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}
          </Col>
          <Col cols={2}>
            {form.get('conditionValue').map(field =>
              <FormGroup>
                <Label htmlFor='rule-conditionValue'
                       hasError={!field.valid}>
                  Value
                </Label>
                <Input id='rule-conditionValue'
                       type='text'
                       value={field.value}
                       onChange={e => onChange('conditionValue', e.target.value)}
                       hasError={!field.valid} />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}
          </Col>
        </Row>
        <HelpBlock>
          Defines the condition which is applied to the metric.
        </HelpBlock>
      </Section>
    </fieldset>
  );
}

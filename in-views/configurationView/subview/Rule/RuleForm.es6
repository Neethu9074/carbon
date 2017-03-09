import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import MetricSelector from 'in-components/MetricSelector';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import {getSingular} from 'in-sdk/pluginName';
import {getCategories} from 'in-sdk/metrics';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {plugins} from 'in-forge/constants';


const pluginsWithMetricDefinitions = Object.keys(plugins)
  .map(key => plugins[key])
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
              A name for this rule. You can select rules by name in the rule binding dialog.
            </HelpBlock>
          </FormGroup>
        )}

        {form.get('entityType').map(field =>
          <FormGroup>
            <Label htmlFor='rule-entityType'
                   hasError={!field.valid}>
              Entity type
            </Label>
            <select onChange={e => onChange(['entityType', 'metricName'], [e.target.value, '-1'])}
                    value={field.value}
                    id='rule-entityType'>
              <option key=''
                      value=''>
                Please select
              </option>
              {pluginsWithMetricDefinitions.map(plugin => {
                return (
                  <option key={plugin}
                          value={plugin}>
                    {getSingular(plugin)}
                  </option>
                );
              })}
            </select>
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              The entity where this rule is applied on.
            </HelpBlock>
          </FormGroup>
        )}

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
                              onChange={e => onChange('metricName', e.target.value)} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
              <HelpBlock>
                The entities metric which is used for processing.
              </HelpBlock>
            </FormGroup>
          )
        : null}

        {form.get('window').map(field =>
          <FormGroup>
            <Label htmlFor='rule-window'
                   hasError={!field.valid}>
              Time window
            </Label>
            <select onChange={e => onChange('window', e.target.value)}
                    value={field.value}
                    id='rule-window'>
              <option value=''>
                Please select
              </option>
              <option value='1000'>
                1s
              </option>
              <option value='5000'>
                5s
              </option>
              <option value='10000'>
                10s
              </option>
              <option value='60000'>
                1min
              </option>
              <option value='300000'>
                5min
              </option>
              <option value='600000'>
                10min
              </option>
            </select>
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}
      </Section>

      <Section>
        {form.get('aggregation').map(field =>
          <FormGroup>
            <Label htmlFor='rule-aggregation'
                   hasError={!field.valid}>
              Aggregation
            </Label>
            <select onChange={e => onChange('aggregation', e.target.value)}
                    value={field.value}
                    id='rule-aggregation'>
              <option value=''>
                Please select
              </option>
              <option value='avg'>
                avg
              </option>
              <option value='sum'>
                sum
              </option>
            </select>
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}
      </Section>

      <Section>
        <SectionHeading>
          Condition
        </SectionHeading>
        {form.get('conditionOperator').map(field =>
          <FormGroup>
            <Label htmlFor='rule-conditionOperator'
                   hasError={!field.valid}>
              Operator
            </Label>
            <select onChange={e => onChange('conditionOperator', e.target.value)}
                    value={field.value}
                    id='rule-conditionOperator'>
              <option value=''>
                Please select
              </option>
              <option value='<'>
                {'<'}
              </option>
              <option value='<='>
                {'<='}
              </option>
              <option value='=='>
                {'=='}
              </option>
              <option value='>='>
                {'>='}
              </option>
              <option value='>'>
                {'>'}
              </option>
              <option value='!='>
                {'!='}
              </option>
            </select>
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

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
      </Section>
    </fieldset>
  );
}

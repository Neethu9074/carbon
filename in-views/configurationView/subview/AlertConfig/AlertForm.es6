import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import MetricSelector from 'in-components/MetricSelector';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Toggle from 'in-components/form/Toggle';
import {getSingular} from 'in-sdk/pluginName';
import {getCategories} from 'in-sdk/metrics';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {plugins} from 'in-forge/constants';

import './AlertForm.less';


const pluginsWithMetricDefinitions = Object.keys(plugins)
  .map(key => plugins[key])
  .filter(plugin => getCategories(plugin).length > 0)
  .sort((a, b) => getSingular(a).localeCompare(getSingular(b)));
const block = 'in-alert-form';

export default function AlertForm({form, onChange}) {
  return (
    <fieldset>
      <Section>
        <SectionHeading>
          Basic Information
        </SectionHeading>

        {form.get('name').map(field =>
          <FormGroup>
            <Label htmlFor='alert-name'
                   hasError={!field.valid}>
              Name
            </Label>
            <Input id='alert-name'
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
          </FormGroup>
        )}

        {form.get('entityType').map(field =>
          <FormGroup>
            <Label htmlFor='alert-entityType'
                   hasError={!field.valid}>
              Entity type
            </Label>
            <select onChange={e => onChange(['entityType', 'metricName'], [e.target.value, '-1'])}
                    value={field.value}
                    id='alert-entityType'>
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
          </FormGroup>
        )}

        {form.get('entityType').value ?
          form.get('metricName').map(field =>
            <FormGroup>
              <Label htmlFor='alert-metricName'
                     hasError={!field.valid}>
                Metric
              </Label>
              <MetricSelector id='alert-metricName'
                              plugin={form.get('entityType').value}
                              value={form.get('metricName').value}
                              onChange={e => onChange('metricName', e.target.value)} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
            </FormGroup>
          )
        : null}

        {form.get('aggregation').map(field =>
          <FormGroup>
            <Label htmlFor='alert-aggregation'
                   hasError={!field.valid}>
              Aggregation
            </Label>
            <select onChange={e => onChange('aggregation', e.target.value)}
                    value={field.value}
                    id='alert-aggregation'>
              <option key=''
                      value=''>
                Please select
              </option>
              <option key='avg'
                      value='avg'>
                avg
              </option>
              <option key='sum'
                      value='sum'>
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

        {form.get('window').map(field =>
          <FormGroup>
            <Label htmlFor='alert-window'
                   hasError={!field.valid}>
              Time window
            </Label>
            <select onChange={e => onChange('window', e.target.value)}
                    value={field.value}
                    id='alert-window'>
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
        <SectionHeading>
          Condition
        </SectionHeading>
        {form.get('threshold').map(field =>
          <FormGroup>
            <Label htmlFor='alert-threshold'
                   hasError={!field.valid}>
              Operator
            </Label>
            <select onChange={e => onChange('threshold', e.target.value)}
                    value={field.value}
                    id='alert-threshold'>
              <option key=''
                      value=''>
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

        {form.get('thresholdValue').map(field =>
          <FormGroup>
            <Label htmlFor='alert-thresholdValue'
                   hasError={!field.valid}>
              Value
            </Label>
            <Input id='alert-thresholdValue'
                   type='number'
                   value={field.value}
                   onChange={e => onChange('thresholdValue', e.target.value)}
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

      <Section>
        <SectionHeading>
          Generated Issue
        </SectionHeading>

        {form.get('text').map(field =>
          <FormGroup>
            <Label htmlFor='alert-text'
                   hasError={!field.valid}>
              Text
            </Label>
            <Input id='alert-text'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('text', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              This text is used as description text when this alert happens.
            </HelpBlock>
          </FormGroup>
        )}

        {form.get('description').map(field =>
          <FormGroup>
            <Label htmlFor='alert-description'
                   hasError={!field.valid}>
              Description
            </Label>
            <TextArea id='alert-description'
                      rows='3'
                      value={field.value}
                      onChange={e => onChange('description', e.target.value)}
                      hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

        {form.get('severity').map(field =>
          <FormGroup>
            <Label htmlFor='alert-severity'
                   hasError={!field.valid}>
              Severity
            </Label>
            <select onChange={e => onChange('severity', e.target.value)}
                    value={field.value}
                    id='alert-severity'>
              <option value=''>
                Please select
              </option>
              <option value='0'>
                change
              </option>
              <option value='5'>
                warning
              </option>
              <option value='10'>
                critical
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

        {form.get('expirationTime').map(field =>
          <FormGroup>
            <Label htmlFor='alert-expirationTime'
                   hasError={!field.valid}>
              Expiration time
            </Label>
            <select onChange={e => onChange('expirationTime', e.target.value)}
                    value={field.value}
                    id='alert-expirationTime'>
              <option key=''
                      value=''>
                Please select
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
            </select>
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

        {form.get('triggering').map(field =>
          <FormGroup>
            <Label htmlFor='alert-triggering'>
              Triggering
            </Label>
            <Toggle id='alert-triggering'
                    className={`${block}__toggle`}
                    checked={field.value}
                    onChange={e => onChange('triggering', e.target.checked)} />
          </FormGroup>
        )}

        {form.get('query').map(field =>
          <FormGroup>
            <Label htmlFor='alert-query'
                   hasError={!field.valid}>
              Applied on filter query
            </Label>
            <Input id='alert-query'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('query', e.target.value)}
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

import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import MetricSelector from 'in-components/MetricSelector';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import Toggle from 'in-components/form/Toggle';
import {getSingular} from 'in-sdk/pluginName';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {plugins} from 'in-forge/constants';

import './AlertForm.less';


const block = 'in-alert-form';

export default function AlertForm({form, onChange}) {
  return (
    <fieldset>
      <Section>
        {form.get('name').map(field =>
          <FormGroup>
            <Label htmlFor='name'
                   hasError={!field.valid}>
              Name
            </Label>
            <Input id='name'
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

        <Group>
          {form.get('entityType').map(field =>
            <FormGroup>
              <Label htmlFor='entityType'
                     hasError={!field.valid}>
                Entity Type
              </Label>
              <select onChange={e => onChange('entityType', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                {Object.keys(plugins).map(key => {
                  const plugin = plugins[key];
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

          {plugins[form.get('entityType').value] ?
            form.get('metricName').map(field =>
              <FormGroup>
                <Label htmlFor='metricName'
                       hasError={!field.valid}>
                  Metric
                </Label>
                <MetricSelector plugin={form.get('entityType').value}
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
        </Group>

        <Group>
          {form.get('rollup').map(field =>
            <FormGroup>
              <Label htmlFor='rollup'
                     hasError={!field.valid}>
                Rollup
              </Label>
              <select onChange={e => onChange('rollup', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='1s'
                        value='1000'>
                  1s
                </option>
                <option key='5s'
                        value='5000'>
                  5s
                </option>
                <option key='1min'
                        value='60000'>
                  1min
                </option>
                <option key='5min'
                        value='300000'>
                  5min
                </option>
                <option key='1h'
                        value='3600000'>
                  1h
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

          {form.get('aggregation').map(field =>
            <FormGroup>
              <Label htmlFor='aggregation'
                     hasError={!field.valid}>
                Aggregation
              </Label>
              <select onChange={e => onChange('aggregation', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='min'
                        value='min'>
                  min
                </option>
                <option key='max'
                        value='max'>
                  max
                </option>
                <option key='avg'
                        value='avg'>
                  avg
                </option>
                <option key='median'
                        value='median'>
                  median
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
              <Label htmlFor='window'
                     hasError={!field.valid}>
                Window
              </Label>
              <select onChange={e => onChange('window', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='1s'
                        value='1000'>
                  1s
                </option>
                <option key='5s'
                        value='5000'>
                  5s
                </option>
                <option key='10s'
                        value='10000'>
                  10s
                </option>
                <option key='1min'
                        value='60000'>
                  1min
                </option>
                <option key='5min'
                        value='300000'>
                  5min
                </option>
                <option key='10min'
                        value='600000'>
                  10min
                </option>
                <option key='1h'
                        value='3600000'>
                  1h
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
        </Group>

        <Group>
          {form.get('threshold').map(field =>
            <FormGroup>
              <Label htmlFor='threshold'
                     hasError={!field.valid}>
                Threshold
              </Label>
              <select onChange={e => onChange('threshold', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='<'
                        value='<'>
                  {'<'}
                </option>
                <option key='<='
                        value='<='>
                  {'<='}
                </option>
                <option key='=='
                        value='=='>
                  {'=='}
                </option>
                <option key='>='
                        value='>='>
                  {'>='}
                </option>
                <option key='>'
                        value='>'>
                  {'>'}
                </option>
                <option key='!='
                        value='!='>
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
              <Label htmlFor='thresholdValue'
                     hasError={!field.valid}>
                Threshold Value
              </Label>
              <Input id='thresholdValue'
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
        </Group>

        <Group>
          {form.get('eventText').map(field =>
            <FormGroup>
              <Label htmlFor='eventText'
                     hasError={!field.valid}>
                Event Text
              </Label>
              <Input id='eventText'
                     type='text'
                     value={field.value}
                     onChange={e => onChange('eventText', e.target.value)}
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
              <Label htmlFor='description'
                     hasError={!field.valid}>
                Description
              </Label>
              <Input id='description'
                     type='text'
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
        </Group>

        <Group>
          {form.get('severity').map(field =>
            <FormGroup>
              <Label htmlFor='severity'
                     hasError={!field.valid}>
                Severity
              </Label>
              <select onChange={e => onChange('severity', e.target.value)}
                      value={field.value}>
                <option key=''
                        value=''>
                  -- select --
                </option>
                <option key='change'
                        value='0'>
                  change
                </option>
                <option key='warning'
                        value='5'>
                  warning
                </option>
                <option key='danger'
                        value='10'>
                  danger
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
              <Label htmlFor='triggering'>
                Is Triggering
              </Label>
              <Toggle className={`${block}__toggle`}
                      checked={field.value}
                      onChange={e => onChange('triggering', e.target.checked)} />
            </FormGroup>
          )}
        </Group>

        <Group>
          {form.get('query').map(field =>
            <FormGroup>
              <Label htmlFor='query'
                     hasError={!field.valid}>
                Filter Query
              </Label>
              <Input id='query'
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
        </Group>
      </Section>
    </fieldset>
  );
}

function Group({children}) {
  return (
    <div className={`${block}__group`}>
      {children}
    </div>
  );
}

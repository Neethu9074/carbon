import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import './ObjectiveForm.less';


const block = 'in-objective-form';

export default function ObjectiveForm({form, onChange, onChangeInThresholds, onAddThreshold, onRemoveThreshold}) {
  const thresholdMessages = form.get('thresholds').messages[0];
  const valueMessages = thresholdMessages.messages.values || [];
  const messageMessages = thresholdMessages.messages.message || [];
  const severityMessages = thresholdMessages.messages.severity || [];

  return (
    <fieldset>
      <Section>
        <SectionHeading>
          Basic Information
        </SectionHeading>

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

        {form.get('filteringQuery').map(field =>
          <FormGroup>
            <Label htmlFor='filteringQuery'
                   hasError={!field.valid}>
              Applied on filter query
            </Label>
            <Input id='filteringQuery'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('filteringQuery', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

        {form.get('timePattern').map(field =>
          <FormGroup>
            <Label htmlFor='timePattern'
                   hasError={!field.valid}>
              Time pattern
            </Label>
            <Input id='timePattern'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('timePattern', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              {'Use Cron systax (e.g. 0 8-20 * * 1-5 -> from 8am to 8 pm every working day)'}
            </HelpBlock>
          </FormGroup>
        )}

        {form.get('timeZoneId').map(field =>
          <FormGroup>
            <Label htmlFor='timeZoneId'
                   hasError={!field.valid}>
              Time zone
            </Label>

            <select onChange={e => onChange('timeZoneId', e.target.value)}
                    value={field.value}>
              <option key=''
                      value=''>
                -- select --
              </option>
              {['UTC−12:00', 'UTC−11:00', 'UTC−10:00', 'UTC−09:30', 'UTC−09:00', 'UTC−08:00', 'UTC−07:00', 'UTC−06:00', 'UTC−05:00', 'UTC−04:00', 'UTC−03:30',
                'UTC−03:00', 'UTC−02:00', 'UTC−01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30', 'UTC+04:00', 'UTC+04:30', 'UTC+05:00',
                'UTC+05:30', 'UTC+05:45', 'UTC+06:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:30', 'UTC+08:45', 'UTC+09:00', 'UTC+09:30', 'UTC+10:00',
                'UTC+10:30', 'UTC+11:00', 'UTC+12:00', 'UTC+12:45', 'UTC+13:00', 'UTC+14:00'
              ].map(timezone =>
                <option key={timezone}
                        value={timezone}>
                  {timezone}
                </option>
              )}
            </select>
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

        {form.get('reductionOperation').map(field =>
          <FormGroup>
            <Label htmlFor='reductionOperation'
                   hasError={!field.valid}>
              Reduction operation
            </Label>
            <Input id='reductionOperation'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('reductionOperation', e.target.value)}
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

      {form.get('thresholds').value.size > 0 ?
        <Section>
          <SectionHeading>
            Thresholds
          </SectionHeading>
          {form.get('thresholds').map(field =>
            field.value.map((threshold, i) =>
              <div key={`threshold_${i}`}>
                <div className={`${block}__remove-button-wrapper`}>
                  <Button kind='danger'
                          size='sm'
                          onClick={() => onRemoveThreshold(i)}>
                    Remove threshold
                  </Button>
                </div>

                <FormGroup>
                  <Label className={`${block}__threshold_label`}
                         htmlFor={`threshold_${i}_value`}>
                    Value
                  </Label>
                  <Input id={`threshold_${i}_value`}
                         type='number'
                         pattern='\d*'
                         value={threshold.get('value')}
                         onChange={e => onChangeInThresholds(i, 'value', e.target.value)} />
                  {valueMessages[i] ? valueMessages[i].map((message, i) =>
                    <ValidationBlock hasError
                                     key={i}>
                      {message}
                    </ValidationBlock>
                  ) : null}
                </FormGroup>

                <FormGroup>
                  <Label className={`${block}__threshold_label`}
                         htmlFor={`threshold_${i}_severity`}>
                    Severity
                  </Label>
                  <select onChange={e => onChangeInThresholds(i, 'severity', e.target.value)}
                          value={threshold.get('severity')}>
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
                    <option key='critical'
                            value='10'>
                      critical
                    </option>
                  </select>
                  {severityMessages[i] ? severityMessages[i].map((message, i) =>
                    <ValidationBlock hasError
                                     key={i}>
                      {message}
                    </ValidationBlock>
                  ) : null}
                </FormGroup>

                <FormGroup>
                  <Label className={`${block}__threshold_label`}
                         htmlFor={`threshold_${i}_message`}>
                    Message
                  </Label>
                  <Input id={`threshold_${i}_message`}
                         type='text'
                         value={threshold.get('message')}
                         onChange={e => onChangeInThresholds(i, 'message', e.target.value)} />
                  {messageMessages[i] ? messageMessages[i].map((message, i) =>
                    <ValidationBlock hasError
                                     key={i}>
                      {message}
                    </ValidationBlock>
                  ) : null}
                </FormGroup>
              </div>
            )
          )}
        </Section>
      : null }

      <Section>
        <Button kind='info'
                onClick={onAddThreshold}>
          Add threshold
        </Button>
      </Section>
    </fieldset>
  );
}

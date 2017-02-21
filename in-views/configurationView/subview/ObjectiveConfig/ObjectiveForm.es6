import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormSection from 'in-components/form/FormSection';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import './ObjectiveForm.less';


const block = 'in-objective-form';

export default function ObjectiveForm({form, onChange, onChangeInThresholds, onAddThreshold, onRemoveThreshold}) {
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

        <FormSection>
          {form.get('filteringQuery').map(field =>
            <FormGroup>
              <Label htmlFor='filteringQuery'
                     hasError={!field.valid}>
                Filtering Query
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
                Time Pattern
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
            </FormGroup>
          )}
        </FormSection>

        <FormSection>
          {form.get('reductionOperation').map(field =>
            <FormGroup>
              <Label htmlFor='reductionOperation'
                     hasError={!field.valid}>
                Reduction Operation
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
        </FormSection>

        <FormSection heading='Thresholds'>
          {form.get('thresholds').map(field =>
            field.value.map((threshold, i) =>
              <FormSection key={`threshold_${i}`}>
                <div className={`${block}__remove-button-wrapper`}>
                  <Button kind='danger'
                          size='sm'
                          onClick={() => onRemoveThreshold(i)}>
                    Remove Threshold
                  </Button>
                </div>

                {['value', 'severity', 'message'].map(type =>
                  <FormGroup key={type}>
                    <Label className={`${block}__threshold_label`}
                           htmlFor={`threshold_${i}_${type}`}>
                      {type}
                    </Label>
                    <Input id={`threshold_${i}_${type}`}
                           type='text'
                           value={threshold.get(type)}
                           onChange={e => onChangeInThresholds(i, type, e.target.value)} />
                  </FormGroup>
                )}
              </FormSection>
            )
          )}

          <Button kind='info'
                  onClick={onAddThreshold}>
            Add Threshold
          </Button>
        </FormSection>
      </Section>
    </fieldset>
  );
}

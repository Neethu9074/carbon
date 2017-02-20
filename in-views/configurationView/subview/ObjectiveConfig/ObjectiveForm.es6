import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import './ObjectiveForm.less';


const block = 'in-objective-form';

export default function ObjectiveForm({form, onChange}) {
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
          {form.get('filteringQuery').map(field =>
            <FormGroup>
              <Label htmlFor='filteringQuery'
                     hasError={!field.valid}>
                Filteringq query
              </Label>
              <Input id='filteringQuery'
                     type='text'
                     value={field.value}
                     onChange={e => onChange('filteringQuery', e.target.value)}
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
        </Group>

        <Group>
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

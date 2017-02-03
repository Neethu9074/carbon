import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import HelpBlock from 'in-components/form/HelpBlock';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';


export default function RoleForm({form, onChange, onSubmit}) {
  return (
    <form onSubmit={onSubmit}>

      <Section>
        {form.get('name').map(field =>
          <FormGroup>
            <Label htmlFor='role-name'
                   hasError={!field.valid}>
              Name
            </Label>
            <Input id='role-name'
                   value={field.value}
                   onChange={e => onChange('name', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map(message =>
              <ValidationBlock hasError>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}

        {form.get('implicitViewFilter').map(field =>
          <FormGroup>
            <Label htmlFor='role-implicit-view-filter'
                   hasError={!field.valid}>
              View Filter
            </Label>
            <Input id='role-implicit-view-filter'
                   value={field.value}
                   onChange={e => onChange('implicitViewFilter', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map(message =>
              <ValidationBlock hasError>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              Define a filter which will be applied to all the views and integrations. Only entities, events and traces
              {' '} matching this filter will be visible to the user.
            </HelpBlock>
          </FormGroup>
        )}
      </Section>
    </form>
  );
}

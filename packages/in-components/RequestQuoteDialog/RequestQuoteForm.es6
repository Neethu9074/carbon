import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './RequestQuoteForm.mless';

export default function RequestQuoteForm({ form, onChange }) {
  return (
    <fieldset>
      <Section>
        <SectionHeading>Account Information</SectionHeading>

        {form.get('companyName').map(field => (
          <FormGroup>
            <Label hasError={!field.valid && field.touched} htmlFor="companyName">
              Company Name
            </Label>
            <Input
              id="companyName"
              value={field.value}
              onChange={e => onChange('companyName', e.target.value)}
              hasError={!field.valid && field.touched}
              autoFocus
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        <div className={locals.row}>
          {form.get('numberOfApmHosts').map(field => (
            <FormGroup className={locals.smallFields}>
              <Label hasError={!field.valid && field.touched} htmlFor="numberOfApmHosts">
                Number of APM Hosts
              </Label>
              <Input
                id="numberOfApmHosts"
                type="number"
                value={field.value}
                onChange={e => onChange('numberOfApmHosts', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
          {form.get('numberOfInfrastructureHosts').map(field => (
            <FormGroup className={locals.smallFields}>
              <Label hasError={!field.valid && field.touched} htmlFor="numberOfInfrastructureHosts">
                Number of IM Hosts
              </Label>
              <Input
                id="numberOfInfrastructureHosts"
                type="number"
                value={field.value}
                onChange={e => onChange('numberOfInfrastructureHosts', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
          {form.get('numberOfYears').map(field => (
            <FormGroup className={locals.smallFields}>
              <Label hasError={!field.valid && field.touched} htmlFor="numberOfYears">
                Number of Years
              </Label>
              <Input
                id="numberOfYears"
                type="number"
                value={field.value}
                onChange={e => onChange('numberOfYears', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </div>
      </Section>
    </fieldset>
  );
}

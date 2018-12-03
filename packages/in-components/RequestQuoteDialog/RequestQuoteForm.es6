import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import './RequestQuoteForm.less';

const block = 'request-quote-form';
export default function RequestQuoteForm({ form, onChange }) {
  return (
    <fieldset>
      <Section>
        <SectionHeading>Account Information</SectionHeading>

        {form.get('companyName').map(field => (
          <FormGroup>
            <Label htmlFor="companyName">Company Name</Label>
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

        <div className={`${block}__row`}>
          {form.get('numberOfApmHosts').map(field => (
            <FormGroup className={`${block}__small_fields`}>
              <Label htmlFor="numberOfApmHosts">Number of APM Hosts</Label>
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
          {form.get('numberOfInfraHosts').map(field => (
            <FormGroup className={`${block}__small_fields`}>
              <Label htmlFor="numberOfInfraHosts">Number of IM Hosts</Label>
              <Input
                id="numberOfInfraHosts"
                type="number"
                value={field.value}
                onChange={e => onChange('numberOfInfraHosts', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
          {form.get('numberOfYears').map(field => (
            <FormGroup className={`${block}__small_fields`}>
              <Label htmlFor="numberOfYears">Number of Years</Label>
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

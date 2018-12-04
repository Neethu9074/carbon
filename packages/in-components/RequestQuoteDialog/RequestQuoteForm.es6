import { fromPromise } from 'reactive-observables';
import React from 'react';

import countries from 'promise-loader?global,geonames!in-services/geonames/countries';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import { getCountryById, getStatesByCountryId, getStateById } from 'in-services/geonames/geonames';
import states from 'promise-loader?global,geonames!in-services/geonames/states';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connect from 'in-hoc/connectTo';

import locals from './RequestQuoteForm.mless';

export default connect(() => ({
  countries: fromPromise(countries()),
  states: fromPromise(states())
}))(function RequestQuoteForm({ countries, states, form, onChange }) {
  const countryList = countries == null ? [] : countries.list;
  const stateList = states == null ? [] : states.list;

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

      <Section>
        <SectionHeading>Billing Information</SectionHeading>

        {form.get('billingStreet').map(field => (
          <FormGroup>
            <Label htmlFor="billingStreet">Street</Label>
            <Input
              id="billingStreet"
              value={field.value}
              onChange={e => onChange('billingStreet', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        <div className={locals.row}>
          {form.get('billingCity').map(field => (
            <FormGroup className={locals.smallFields}>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                value={field.value}
                onChange={e => onChange('billingCity', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
          {form.get('billingCountry').map(field => (
            <FormGroup className={locals.smallFields}>
              <Label htmlFor="billingCountry">Country</Label>
              <ComboBox
                id="billingCountry"
                name="billingCountry"
                placeholder=""
                value={field.value == null ? '' : getCountryById(countryList, field.value).id}
                options={countryList.map(option => {
                  return {
                    value: option.id,
                    label: option.name
                  };
                })}
                onChange={e => onChange('billingCountry', e ? e.value : e)}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
          {form.get('billingState').map(field => {
            const companyField = form.get('billingCountry');

            return (
              <FormGroup className={locals.smallFields}>
                <Label htmlFor="billingState">State</Label>
                <ComboBox
                  id="billingState"
                  name="billingState"
                  disabled={companyField.value == null}
                  placeholder=""
                  value={field.value == null ? '' : getStateById(stateList, field.value).id}
                  options={getStatesByCountryId(stateList, companyField.value || '').map(option => {
                    return {
                      value: option.id,
                      label: option.name
                    };
                  })}
                  onChange={e => onChange('billingState', e ? e.value : e)}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            );
          })}
        </div>
        {form.get('billingZip').map(field => (
          <FormGroup>
            <Label htmlFor="billingZip">Zip</Label>
            <Input
              id="billingZip"
              value={field.value}
              onChange={e => onChange('billingZip', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>
    </fieldset>
  );
});

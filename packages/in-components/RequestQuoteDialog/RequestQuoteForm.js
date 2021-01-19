/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromPromise } from '@instana/observables';
import React from 'react';

import { getCountries, getStatesByCountryName } from 'in-services/geonames/geonames';
import geodata from 'promise-loader?global,geonames!in-services/geonames/geodata';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connect from 'in-hoc/connectTo';

import locals from './RequestQuoteForm.mless';

export default connect(() => ({
  geodata: fromPromise(geodata())
}))(function RequestQuoteForm({ geodata, form, onChange }) {
  const geo = geodata == null ? [] : geodata.data;

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
              type="text"
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
            <FormGroup className={locals.threeFields}>
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
            <FormGroup className={locals.threeFields}>
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
            <FormGroup className={locals.threeFields}>
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
            <Label hasError={!field.valid && field.touched} htmlFor="billingStreet">
              Street
            </Label>
            <Input
              type="text"
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
            <FormGroup className={locals.twoFields}>
              <Label hasError={!field.valid && field.touched} htmlFor="billingCity">
                City
              </Label>
              <Input
                type="text"
                id="billingCity"
                value={field.value}
                onChange={e => onChange('billingCity', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

          {form.get('billingZip').map(field => (
            <FormGroup className={locals.twoFields}>
              <Label hasError={!field.valid && field.touched} htmlFor="billingZip">
                Zip
              </Label>
              <Input
                type="text"
                id="billingZip"
                value={field.value}
                onChange={e => onChange('billingZip', e.target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </div>

        <div className={locals.row}>
          {form.get('billingCountry').map(field => (
            <FormGroup className={locals.twoFields}>
              <Label hasError={!field.valid && field.touched} htmlFor="billingCountry">
                Country
              </Label>
              <ComboBox
                id="billingCountry"
                name="billingCountry"
                placeholder=""
                value={field.value}
                options={getCountries(geo).map(country => {
                  return {
                    value: country,
                    label: country
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
              <FormGroup className={locals.twoFields}>
                <Label hasError={!field.valid && field.touched} htmlFor="billingState">
                  State
                </Label>
                <ComboBox
                  id="billingState"
                  name="billingState"
                  disabled={companyField.value == null}
                  placeholder=""
                  value={field.value}
                  options={getStatesByCountryName(geo, companyField.value || '').map(state => {
                    return {
                      value: `${state.code}`,
                      label: `${state.code} - ${state.name}`
                    };
                  })}
                  onChange={e => onChange('billingState', e ? e.value : e)}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            );
          })}
        </div>
      </Section>
    </fieldset>
  );
});

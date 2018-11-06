import React from 'react';

import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import Section from 'in-views/configurationView/components/Section';
import FormDataEnrichment from './components/FormDataEnrichment';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import DateInput from 'in-components/form/DateInput';
import Helpify from 'in-components/form/Helpify';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './MaintenanceConfigurationForm.mless';

export default function MaintenanceConfigurationForm(props) {
  const { form, onChange } = props;

  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} />

      <Section>
        {form.get('name').map(field => (
          <FormGroup className={locals}>
            <Label htmlFor="name" hasError={!field.valid && field.touched}>
              Name
            </Label>
            <Input
              id="name"
              className={locals.input}
              type="text"
              value={field.value}
              onChange={e => onChange('name', e.target.value)}
              hasError={!field.valid}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>

      <Section>
        {form.get('query').map(field => (
          <FormGroup>
            <Label htmlFor="query" hasError={!field.valid && field.touched}>
              Query
            </Label>
            <Helpify helpText="All alerts for matching incidents, issues or changes will be muted. Please note: if you leave the query field empty, ALL alerts will be turned off for the duration of this maintenance window.">
              <Input
                id="query"
                className={locals.helpfifiedInput}
                type="text"
                value={field.value}
                onChange={e => onChange('query', e.target.value)}
                hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
              />
            </Helpify>
            <BackendValidationMessages validationResult={form.get('validationResult').value} />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>

      <Section>
        <DateWithTime label="Start date" path="start" {...props} />
        <DateWithTime label="End date" path="end" {...props} />
      </Section>
    </fieldset>
  );
}

function DateWithTime({ form, label, path, setForm }) {
  const windowForm = form.get('window');
  const dateField = windowForm.get(path).get('date');
  const timeField = windowForm.get(path).get('time');

  return (
    <FormGroup>
      <Label htmlFor="query" hasError={!windowForm.valid && windowForm.touched}>
        {label}
      </Label>
      <DateInput
        id={`${path}-date`}
        value={dateField.value}
        onChange={v => setValue(form, ['window', path, 'date'], v)}
        hasError={!dateField.valid && dateField.touched}
        className={locals.field}
      />
      <Input
        type="text"
        id={`${path}-time`}
        value={timeField.value}
        onChange={e => setValue(form, ['window', path, 'time'], e.target.value)}
        onBlur={e => setValue(form, ['window', path, 'time'], formatInputTime(e.target.value, 'HH:mm:ss'))}
        hasError={!timeField.valid && timeField.touched}
        className={locals.field}
      />
    </FormGroup>
  );

  function setValue(form, path, value) {
    setForm(form.updateIn(path, item => item.setValue(value).setTouched(true)));
  }
}

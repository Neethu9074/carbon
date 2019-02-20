import React from 'react';

import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import FormDataEnrichment from './components/FormDataEnrichment';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicator';
import FormGroup from 'in-settings/components/FormGroup';
import DateInput from 'in-components/form/DateInput';
import HelpText from 'in-components/form/HelpText';
import { Row, Col } from 'in-components/Grid';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Link from 'in-components/Link';

import locals from './MaintenanceConfigurationForm.mless';

export default function MaintenanceConfigurationForm(props) {
  const { form, onChange, onChangeApplyOn, setForm } = props;

  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} setForm={setForm} />

      {form.get('name').map(field => (
        <FormGroup style={{ marginTop: '1rem' }}>
          <HelpText large>1. Define a name for your maintenance window that will show up in the list</HelpText>
          <Label htmlFor="maintenance-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="maintenance-name"
            className={locals.input}
            type="text"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid}
          />
          <TouchedMessages field={field} />
          <DescriptionText>Mainentance window names should be unique and meaningful.</DescriptionText>
        </FormGroup>
      ))}
      {form.get('applyOn').map(field => (
        <FormGroup>
          <HelpText large>2. Select the entities to be muted</HelpText>
          <Label htmlFor="maintenance-applyOn" hasError={!field.valid && field.touched}>
            Apply on
          </Label>
          <ComboBox
            name="maintenance-applyOn"
            value={field.value}
            options={[
              { value: 'dfq', label: 'Selected entities (Dynamic Focus query)' },
              { value: 'all', label: 'All available entities' }
            ]}
            clearable={false}
            onChange={e => {
              const updatedForm = onChangeApplyOn(form, e ? e.value : null);
              if (updatedForm) {
                setForm(updatedForm);
              }
            }}
          />
          <TouchedMessages field={field} />
          {form.get('applyOn').value === 'all' && (
            <DescriptionText>
              <strong>Caution!</strong> All alerts will be muted for the duration of this maintenance window.{' '}
              <strong>This might affect other users in your organization as well.</strong>
            </DescriptionText>
          )}
        </FormGroup>
      ))}

      {form.get('applyOn').value === 'dfq' &&
        form.get('query').map(field => (
          <FormGroup>
            <Label htmlFor="maintenance-query" hasError={!field.valid && field.touched}>
              Dynamic Focus Query
            </Label>
            <Input
              id="maintenance-query"
              className={locals.input}
              type="text"
              placeholder={'e.g. entity.zone:"dev" AND NOT entity.host.fqdn:ip-172*'}
              value={field.value}
              onChange={e => onChange('query', e.target.value)}
              hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
            />
            {form.get('queryValidationInProgress').value && (
              <LoadingIndicator type="dark" className={locals.queryLoading} inline />
            )}
            <BackendValidationMessages validationResult={form.get('validationResult').value} />
            <TouchedMessages field={field} />
            <DescriptionText>
              A <strong>non-empty</strong> filter query which defines the matching alerts for incidents, issues, changes
              and online/offline to be muted. Select <i>&quot;Apply on: All available entities&quot;</i> if you want to
              mute all alerts. For more information on syntax, please see our&nbsp;
              <Link href="https://docs.instana.io/core_concepts/dynamic_focus/#usage" external>
                documentation
              </Link>
              .
            </DescriptionText>
          </FormGroup>
        ))}
      <FormGroup noFlex>
        <HelpText large>3. Set the start and end of your maintenance window</HelpText>
        <Row>
          <Button
            kind="action"
            className={locals.unscheduleButton}
            onClick={() => {
              let updatedForm = form.updateIn(['window', 'start', 'date'], item => item.setValue('').setTouched(true));
              updatedForm = updatedForm.updateIn(['window', 'start', 'time'], item =>
                item.setValue('').setTouched(true)
              );
              updatedForm = updatedForm.updateIn(['window', 'end', 'date'], item => item.setValue('').setTouched(true));
              updatedForm = updatedForm.updateIn(['window', 'end', 'time'], item => item.setValue('').setTouched(true));
              setForm(updatedForm);
            }}
          >
            Clear dates
          </Button>
        </Row>

        <Row>
          <Col cols={6}>
            <DateWithTime label="Start date" path="start" {...props} />
          </Col>
          <Col cols={6}>
            <DateWithTime label="End date" path="end" {...props} />
          </Col>
        </Row>
        <TouchedMessages field={form.get('window')} />
        <DescriptionText>Maintenance windows without start or end dates will be ignored.</DescriptionText>
      </FormGroup>
    </fieldset>
  );
}

function DateWithTime({ form, label, path, setForm }) {
  const windowForm = form.get('window');
  const dateField = windowForm.get(path).get('date');
  const timeField = windowForm.get(path).get('time');

  return (
    <FormGroup withoutBottomMargin>
      <Label htmlFor={`maintenance-${path}-date`} hasError={!windowForm.valid && windowForm.touched}>
        {label}
      </Label>
      <Row>
        <Col cols={5}>
          <DateInput
            id={`maintenance-${path}-date`}
            value={dateField.value}
            onChange={v => setValue(form, ['window', path, 'date'], v)}
            hasError={!dateField.valid && dateField.touched}
            className={locals.input}
          />
        </Col>
        <Col cols={5}>
          <Input
            type="text"
            id={`maintenance-${path}-time`}
            value={timeField.value}
            placeholder="00:00:00"
            onChange={e => setValue(form, ['window', path, 'time'], e.target.value)}
            onBlur={e => setValue(form, ['window', path, 'time'], formatInputTime(e.target.value, 'HH:mm:ss'))}
            hasError={!timeField.valid && timeField.touched}
            className={locals.input}
          />
        </Col>
      </Row>
    </FormGroup>
  );

  function setValue(form, path, value) {
    setForm(form.updateIn(path, item => item.setValue(value).setTouched(true)));
  }
}

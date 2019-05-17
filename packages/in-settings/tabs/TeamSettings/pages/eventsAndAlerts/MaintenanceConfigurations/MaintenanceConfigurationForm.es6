import React from 'react';
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range';

import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { userSettingsGeneral, getEntityIdView } from 'in-settings/navigation/paths';
import FormDataEnrichment from './components/FormDataEnrichment';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSetting$ } from 'in-services/settings/settings';
import FormGroup from 'in-settings/components/FormGroup';
import DateInput from 'in-components/form/DateInput';
import HelpText from 'in-components/form/HelpText';
import Message from 'in-new-components/Message';
import { Row, Col } from 'in-components/Grid';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './MaintenanceConfigurationForm.mless';

const IconErrorOutline = <SvgIcon type={'lib_help_error_error_outline'} height={20} width={20} color="#40535b" />;

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
            maxLength={256}
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
              maxLength={2048}
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
          <Col cols={12}>
            <DescriptionTextWithCurrentTimeZone />
          </Col>
        </Row>

        <Row>
          <Col cols={5}>
            <DateWithTime label="Start time" path="start" {...props} />
          </Col>
          <Col cols={5}>
            <DateWithTime label="End time" path="end" {...props} />
          </Col>
          <Col cols={2}>
            <Button
              kind="action"
              className={locals.unscheduleButton}
              onClick={() => {
                let updatedForm = form.updateIn(['window', 'start', 'date'], item =>
                  item.setValue('').setTouched(true)
                );
                updatedForm = updatedForm.updateIn(['window', 'start', 'time'], item =>
                  item.setValue('').setTouched(true)
                );
                updatedForm = updatedForm.updateIn(['window', 'end', 'date'], item =>
                  item.setValue('').setTouched(true)
                );
                updatedForm = updatedForm.updateIn(['window', 'end', 'time'], item =>
                  item.setValue('').setTouched(true)
                );
                setForm(updatedForm);
              }}
            >
              Clear dates
            </Button>
          </Col>
        </Row>
        <TouchedMessages field={form.get('window')} />
        <DescriptionText>Maintenance windows without start or end dates will be ignored.</DescriptionText>
      </FormGroup>
    </fieldset>
  );
}

const DescriptionTextWithCurrentTimeZone = connectTo(
  () => ({
    href: getEntityIdView(userSettingsGeneral),
    asUtc: getSetting$('formatTimestampsAsUtc')
  }),
  function DescriptionTextWithCurrentTimeZone({ asUtc, href }) {
    const texts = {
      timezone: `Your current timezone is "${getTimezone()}"`,
      utcTimezone: `All dates and times are in "UTC".`,
      utcOffset: `UTC${getUtcOffset(moment())}${isDST(moment()) ? ', DST is in effect' : ''}.`,
      changeToUtc: 'You can change this to UTC in the',
      changeToLocalTime: 'You can change this to local time in the'
    };

    const message =
      (asUtc
        ? texts.utcTimezone + ' ' + texts.changeToLocalTime
        : texts.timezone + ' ' + texts.utcOffset + ' ' + texts.changeToUtc) + ' ';

    return (
      <Message className={locals.messageWrapper} icon={IconErrorOutline}>
        <div>
          {message}
          <Link href={href}>User Settings &gt; General User Interface Settings</Link>
        </div>
      </Message>
    );
  }
);

const DateWithTime = connectTo(
  () => ({
    asUtc: getSetting$('formatTimestampsAsUtc')
  }),
  function DateWithTime({ asUtc, form, label, path, setForm }) {
    const windowForm = form.get('window');
    const dateField = windowForm.get(path).get('date');
    const timeField = windowForm.get(path).get('time');

    const toMoment = (dateFieldValue, timeFieldValue) =>
      dateFieldValue && timeFieldValue
        ? moment(dateFieldValue + ' ' + formatInputTime(timeFieldValue, 'HH:mm:ss'))
        : moment(dateFieldValue);

    const getTimeZoneInfoMessage = (dateFieldValue, timeFieldValue) => {
      if (dateFieldValue) {
        const currentTimeZone = getTimezone();
        const currentDateIsDst = isDST(moment());
        const momentSelectedDate = toMoment(dateFieldValue, timeFieldValue);
        const selectedDateIsDst = isDST(momentSelectedDate);
        const selectedUtcOffset = getUtcOffset(momentSelectedDate);

        let dstMsg = '';
        if (currentDateIsDst && !selectedDateIsDst) {
          dstMsg = 'DST not in effect';
        }
        if (!currentDateIsDst && selectedDateIsDst) {
          dstMsg = 'DST in effect';
        }

        return dstMsg && `${dstMsg}. ${label} is "${currentTimeZone}" (UTC${selectedUtcOffset})`;
      } else {
        return null;
      }
    };

    const message = !asUtc && getTimeZoneInfoMessage(dateField.value, timeField.value);

    return (
      <FormGroup withoutBottomMargin>
        <Label htmlFor={`maintenance-${path}-date`} hasError={!windowForm.valid && windowForm.touched}>
          {label}
        </Label>
        <Row>
          <Col cols={5}>
            <DateInput
              id={`maintenance-${path}-date`}
              placeholder="YYYY-MM-DD"
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
          {message && (
            <Col cols={10}>
              <Message className={locals.submessageWrapper} icon={IconErrorOutline}>
                <div>{message}</div>
              </Message>
            </Col>
          )}
        </Row>
      </FormGroup>
    );

    function setValue(form, path, value) {
      setForm(form.updateIn(path, item => item.setValue(value).setTouched(true)));
    }
  }
);

const getTimezone = () => moment.tz.guess(true);
const getUtcOffset = moment => moment.format('ZZ');
const isDST = moment => moment.isDST();

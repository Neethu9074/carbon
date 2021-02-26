/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

import Applications, {
  applicationSelectionTableActions,
  getSelectedApplicationsForAlert,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import InputWithDFQSelectionList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/InputWithDFQSelectionList';
import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { userSettingsGeneral, getEntityIdView } from 'in-settings/navigation/paths';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import FormDataEnrichment from './components/FormDataEnrichment';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { Row, Col } from 'in-new-components/layout/Grid/Grid';
import { getSetting$ } from 'in-services/settings/settings';
import FormGroup from 'in-settings/components/FormGroup';
import DateInput from 'in-components/form/DateInput';
import HelpText from 'in-components/form/HelpText';
import moment from 'in-services/moment-timezone';
import Message from 'in-new-components/Message';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './MaintenanceConfigurationForm.mless';

export default function MaintenanceConfigurationForm(props) {
  const { form, onChange, onChangeApplyOn, setForm } = props;
  const selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} setForm={setForm} />

      {form.get('name').map(field => (
        <FormGroup style={{ marginTop: '1rem' }}>
          <HelpText large>{t('in-settings:tabs.1DefineANameForYourMaintenanceWindowThatWillShowUpInTheList')}</HelpText>
          <Label htmlFor="maintenance-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
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
          <DescriptionText>{t('in-settings:tabs.mainentanceWindowNamesShouldBeUniqueAndMeaningful')}</DescriptionText>
        </FormGroup>
      ))}
      {form.get('applyOn').map(field => (
        <FormGroup>
          <HelpText large>{t('in-settings:tabs.2SelectTheEntitiesToBeMuted')}</HelpText>
          <Label htmlFor="maintenance-applyOn" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.applyOn')}
          </Label>
          <ComboBox
            name="maintenance-applyOn"
            value={field.value}
            options={[
              { value: 'application', label: t('in-settings:tabs.applicationPerspective') },
              {
                value: 'dfq',
                label: t('in-settings:tabs.selectedEntitiesDynamicFocusQuery')
              },
              { value: 'all', label: t('in-settings:tabs.allAvailableEntities') }
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
              <Trans i18nKey="in-settings:tabs.allAlertsWillBeMutedForTheDurationOfThisMaintenanceWindow" />
            </DescriptionText>
          )}
        </FormGroup>
      ))}

      {form.get('applyOn').value === 'dfq' &&
        form.get('query').map(field => (
          <FormGroup className={locals.dfqForm}>
            <Label htmlFor="maintenance-query" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.dynamicFocusQuery')}
            </Label>
            <InputWithDFQSelectionList
              id="maintenance-query"
              type="text"
              placeholder={t('in-settings:tabs.formatExample', {
                format: 'entity.zone:"dev" AND NOT entity.host.fqdn:ip-172*'
              })}
              value={field.value}
              onChange={value => onChange('query', value)}
              hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
              maxLength={2048}
            />
            {form.get('queryValidationInProgress').value && <LoadingIndicator className={locals.queryLoading} inline />}
            <BackendValidationMessages validationResult={form.get('validationResult').value} />
            <TouchedMessages field={field} />
            <DescriptionText>
              <Trans
                i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesTheMatchingAlerts"
                components={{
                  docLink: <Link href="https://instana.com/docs/dynamic_focus/#syntax" external />
                }}
              />
            </DescriptionText>
          </FormGroup>
        ))}

      {form.get('applyOn').value === 'application' &&
        form.get('applicationIds').map(field => (
          <FormGroup>
            <Applications
              setTitle={false}
              loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
              hasRowNavigation={false}
              noDataMessage={t('in-settings:tabs.noApplicationPerspectivesSelected')}
              tableActions={applicationSelectionTableActions(form, setForm)}
              rightHeader={
                <SelectListDialogButton
                  form={form}
                  onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                  title={t('in-settings:tabs.addApplicationPerspectives')}
                  label={t('in-settings:tabs.addApplicationPerspectives')}
                  listComponent={Applications}
                  listComponentRightHeader={noRightHeader}
                  limit={10}
                  hiddenIds={selectedApplicationIds}
                  createSubmitLabel={numberOfItems =>
                    numberOfItems > 0
                      ? t('in-settings:tabs.addNumberOfItemsApplicationPerspective', { count: numberOfItems })
                      : t('in-settings:tabs.add')
                  }
                  requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneApplicationPerspectives')}
                />
              }
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      <FormGroup noFlex>
        <HelpText large>{t('in-settings:tabs.3SetTheStartAndEndOfYourMaintenanceWindow')}</HelpText>

        <Row>
          <Col lg={12}>
            <DescriptionTextWithCurrentTimeZone />
          </Col>
        </Row>

        <Row>
          <Col lg={5}>
            <DateWithTime label={t('in-settings:tabs.startTime')} path="start" {...props} />
          </Col>
          <Col lg={5}>
            <DateWithTime label={t('in-settings:tabs.endTime')} path="end" {...props} />
          </Col>
          <Col lg={2}>
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
              {t('in-settings:tabs.clearDates')}
            </Button>
          </Col>
        </Row>
        <TouchedMessages field={form.get('window')} />
        <DescriptionText>{t('in-settings:tabs.maintenanceWindowsWithoutStartOrEndDatesWillBeIgnored')}</DescriptionText>
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
      timezone: t('in-settings:tabs.yourCurrentTimezoneIs', { tz: getTimezone() }),
      utcTimezone: t('in-settings:tabs.allDatesAndTimesAreInUtc'),
      utcOffset: t('in-settings:tabs.utcOffset', {
        utcOffSet: getUtcOffset(moment()),
        isDST: isDST(moment()) ? t('in-settings:tabs.dstIsInEffect') : ''
      }),
      changeToUtc: t('in-settings:tabs.youCanChangeThisToUtc'),
      changeToLocalTime: t('in-settings:tabs.youCanChangeThisToLocalTime')
    };

    const message =
      (asUtc
        ? texts.utcTimezone + ' ' + texts.changeToLocalTime
        : texts.timezone + ' ' + texts.utcOffset + ' ' + texts.changeToUtc) + ' ';

    return (
      <Message className={locals.messageWrapper} withIcon small>
        <div>
          {message}
          <Link href={href}>{t('in-settings:tabs.userSettingsGeneralUserInterfaceSettings')}</Link>
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
          dstMsg = t('in-settings:tabs.dstNotInEffect');
        }
        if (!currentDateIsDst && selectedDateIsDst) {
          dstMsg = t('in-settings:tabs.dstInEffect');
        }

        return (
          dstMsg &&
          t('in-settings:tabs.dstMsg', {
            dstMsg: dstMsg,
            label: label,
            currentTimeZone: currentTimeZone,
            selectedUtcOffset: selectedUtcOffset
          })
        );
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
          <Col lg={5}>
            <DateInput
              id={`maintenance-${path}-date`}
              placeholder="YYYY-MM-DD"
              value={dateField.value}
              onChange={v => setValue(form, ['window', path, 'date'], v)}
              hasError={!dateField.valid && dateField.touched}
              className={locals.input}
            />
          </Col>
          <Col lg={5}>
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
            <Col lg={10}>
              <Message className={locals.submessageWrapper} withIcon small>
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

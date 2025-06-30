/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isValid, parse } from 'date-fns';
import React from 'react';

import { Message, keyCodes, Button, Link } from '@instana/components';

import Applications, {
  applicationSelectionTableActions,
  getSelectedApplicationsForAlert,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/components/Applications';
import SelectListDialogButton from 'in-settings/tabs/GlobalSettings/components/SelectListDialogButton';
import formatInputTime from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { userSettingsGeneral, getEntityIdView } from 'in-settings/navigation/paths';
import { dateFormat, dateTimeFormat } from 'in-services/formatters/date';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import { getSetting$ } from 'in-services/settings/settings';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import DateInput from 'in-components/form/DateInput';
import HelpText from 'in-components/form/HelpText';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import { t, Trans } from 'in-i18n';

import locals from './MaintenanceConfigurationForm.mless';

export default function MaintenanceConfigurationForm(props) {
  const { form, onChange, onChangeApplyOn, setForm } = props;
  const selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  return (
    <fieldset
      onKeyDown={event => {
        // avoid pressing enter in any input field to trigger a button onClick event
        if (keyCodes.isReturn(event)) {
          event.preventDefault();
        }
      }}
    >
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
          <DescriptionText>{t('in-settings:tabs.maintenanceWindowNamesShouldBeUniqueAndMeaningful')}</DescriptionText>
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
            isClearable={false}
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
            <DfqSearchBar
              id="maintenance-query"
              theme="light"
              onQueryValueChange={value => {
                onChange('query', value);
              }}
              queryValue={field.value || ''}
              manageFiltersDisabled
            />
            <DescriptionText>
              <Trans
                i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesTheMatchingAlerts"
                components={{
                  docLink: <Link size="sm" href="https://ibm.biz/dynamic-focus-syntax" external />
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

export function DescriptionTextWithCurrentTimeZone() {
  const { createHrefToPath } = useNavigation();
  const href = getEntityIdView(userSettingsGeneral, undefined, createHrefToPath);
  const asUtc = getSetting$('formatTimestampsAsUtc');
  const texts = {
    timezone: t('in-settings:tabs.yourCurrentTimezoneIs', { tz: getTimezone() }),
    utcTimezone: t('in-settings:tabs.allDatesAndTimesAreInUtc'),
    utcOffset: t('in-settings:tabs.utcOffset', {
      utcOffSet: getUtcOffset(new Date()),
      isDST: isDstObserved(new Date()) ? t('in-settings:tabs.dstIsInEffect') : ''
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

const DateWithTime = connectTo(
  () => ({
    asUtc: getSetting$('formatTimestampsAsUtc')
  }),
  function DateWithTime({ asUtc, form, label, path, setForm }) {
    const windowForm = form.get('window');
    const dateField = windowForm.get(path).get('date');
    const timeField = windowForm.get(path).get('time');

    const toDate = (dateFieldValue, timeFieldValue) =>
      dateFieldValue && timeFieldValue
        ? parse(dateFieldValue + ' ' + formatInputTime(timeFieldValue, 'HH:mm:ss'), dateTimeFormat, new Date())
        : parse(dateFieldValue, dateFormat, new Date());

    const getTimeZoneInfoMessage = (dateFieldValue, timeFieldValue) => {
      if (dateFieldValue) {
        const currentTimeZone = getTimezone();
        const currentDateIsDst = isDstObserved(new Date());
        const selectedDate = toDate(dateFieldValue, timeFieldValue);
        const isSelectedDateValid = isValid(selectedDate);
        const selectedDateIsDst = isSelectedDateValid && isDstObserved(selectedDate);
        const selectedUtcOffset = isSelectedDateValid && getUtcOffset(selectedDate);

        let dstMsg = '';
        if (currentDateIsDst && !selectedDateIsDst) {
          dstMsg = t('in-settings:tabs.dstNotInEffect');
        }
        if (!currentDateIsDst && selectedDateIsDst) {
          dstMsg = t('in-settings:tabs.dstInEffect');
        }

        return (
          isSelectedDateValid &&
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

const getTimezone = () => new Intl.DateTimeFormat().resolvedOptions().timeZone;
const getUtcOffset = date => formatDateWithActiveLanguage(date, 'xx');

const stdTimezoneOffset = date => {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);

  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

// This code uses the fact that getTimezoneOffset returns a greater value during Standard Time versus Daylight Saving Time (DST).
// Thus it determines the expected output during Standard Time, and it compares whether the output of the given date the same (Standard) or less (DST).
// Ref: https://stackoverflow.com/a/11888430
const isDstObserved = date => {
  return date.getTimezoneOffset() < stdTimezoneOffset(date);
};

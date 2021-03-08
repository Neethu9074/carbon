/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import {
  sloTarget,
  apConfigId,
  timeWindowType,
  timeWindowDuration,
  timeWindowDurationUnit,
  timeWindowStart,
  removeFormForStartTimeStamp,
  addFormForStartTimeStamp,
  removeFormForTimeDuration,
  addFormForTimeDuration,
  dynamic,
  fixed,
  rolling,
  sliConfigId
} from 'in-custom-dashboards/widgets/Slo/form';
import {
  trackAPSelected,
  trackOpenSLIManagement,
  debouncedTrackSloChanged,
  trackStartEditingSloWidgetConfig,
  trackTimeWindowTypeChanged
} from 'in-custom-dashboards/widgets/Slo/tracker';
import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import PercentageFormInput from 'in-custom-dashboards/widgets/Slo/components/PercentageFormInput';
import SliSelectionForm from 'in-custom-dashboards/widgets/Slo/components/SliSelectionForm';
import APConfigSelector from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SliManageList from 'in-custom-dashboards/widgets/Slo/sli/SliManageList';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import Header from 'in-new-components/workspace/Header';
import Select from 'in-components/form/Select/Select';
import DateInput from 'in-components/form/DateInput';
import Input from 'in-components/form/Input/Input';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';
import { Trans, t } from 'in-i18n';

import locals from './FormComponent.mless';

export default function FormComponent({ form, onChange: originalOnChange, setSlideInView }) {
  const [configChanged, setConfigChanged] = useState();
  const onChange = (path, onField) => {
    if (!configChanged) {
      trackStartEditingSloWidgetConfig();
      setConfigChanged(true);
    }
    return originalOnChange(path, onField);
  };
  const [apConfig, setApConfig] = useState();
  const apConfigs = useObservable(getApplicationConfigObservable, []);

  const apConfigIdField = form.get(apConfigId);
  const appConfigIdValue = apConfigIdField?.value;
  if (apConfigs && !apConfig) {
    // initial setting
    const newApConfig = apConfigs.find(apConfig => apConfig.id === appConfigIdValue);
    if (newApConfig !== apConfig) setApConfig(newApConfig);
  }

  const timeWindowTypeValue = form.get(timeWindowType)?.value ?? dynamic;
  const isFixed = timeWindowTypeValue === fixed;
  const isRolling = timeWindowTypeValue === rolling;

  const onChangeTimeWindowType = value => {
    onChange([], form => {
      let updatedForm;
      if (value === fixed) {
        updatedForm = addFormForStartTimeStamp(form);
        updatedForm = addFormForTimeDuration(updatedForm, {}, false);
      } else {
        updatedForm = removeFormForStartTimeStamp(form);
        if (value === dynamic) {
          updatedForm = removeFormForTimeDuration(updatedForm);
        } else {
          updatedForm = addFormForTimeDuration(updatedForm, {}, false);
        }
      }
      return updatedForm.updateIn([timeWindowType], f => f.setValue(value).setTouched(true));
    });
    trackTimeWindowTypeChanged({ type: value });
  };

  const timeWindowDurationUnitValue =
    form.get(timeWindowDurationUnit)?.value ?? t('in-custom-dashboards:widgets.slo.formComponent.weeks');

  const onChangeTimeDurationUnit = value => {
    onChange([], form => {
      const oldDuration = form.get(timeWindowDuration).value;
      const maxDurationForThisUnit = getMaxTimeWindowDurationValue(value);
      return form
        .updateIn([timeWindowDurationUnit], f => f.setValue(value).setTouched(true))
        .updateIn([timeWindowDuration], f =>
          f.setValue(Math.min(oldDuration, maxDurationForThisUnit)).setTouched(true)
        );
    });
  };
  const dateField = form.get(timeWindowStart)?.get('date');
  const timeField = form.get(timeWindowStart)?.get('time');

  function activateManageSliSlideIn() {
    return setSlideInView({
      renderTitle(sliSelected) {
        if (sliSelected === null) {
          return t('in-custom-dashboards:widgets.slo.formComponent.sliManagement');
        }
        return sliSelected?.id
          ? t('in-custom-dashboards:widgets.slo.formComponent.editSli')
          : t('in-custom-dashboards:widgets.slo.formComponent.createSli');
      },
      slideOutHandler(slideOut, [sliSelected, selectSli]) {
        return () => {
          if (sliSelected == null) {
            slideOut(); // close list
          } else {
            // "cancel"/close, go back to list
            selectSli(null);
          }
        };
      },
      getContent({ subSlideState }) {
        return (
          <SliManageList
            applicationId={appConfigIdValue}
            apName={apConfig.label}
            apDefaultBoundaryScope={apConfig.boundaryScope}
            subSlideState={subSlideState}
          />
        );
      }
    });
  }

  function onUpdateApConfigId(apId) {
    const newApConfig = apConfigs.find(apConfig => apConfig.id === apId);
    setApConfig(newApConfig);
    onChange([], formField =>
      formField
        .updateIn([apConfigId], f => f.setValue(apId).setTouched(true))
        .updateIn([sliConfigId], f => f.setValue('').setTouched(false))
    );
    trackAPSelected({ applicationId: apId });
  }

  return (
    <Stack space="normal">
      <Header>{t('in-custom-dashboards:widgets.slo.formComponent.sloConfig')}</Header>

      <Stack space="xsmall">
        <APConfigSelector
          apConfigIdField={apConfigIdField}
          apConfigs={apConfigs}
          onUpdateApConfigId={onUpdateApConfigId}
        />

        <SliSelectionForm
          form={form}
          applicationId={appConfigIdValue}
          onChange={onChange}
          openManageSLIComponent={
            <Button
              disabled={!apConfig}
              kind="primary"
              onClick={() => {
                activateManageSliSlideIn();
                trackOpenSLIManagement({ applicationId: appConfigIdValue });
              }}
            >
              {t('in-custom-dashboards:widgets.slo.formComponent.manageSlIs')}
            </Button>
          }
        />

        <Sections>
          {form.get(sloTarget).map(field => (
            <Section
              title={t('in-custom-dashboards:widgets.slo.formComponent.sloTarget')}
              titleHtmlFor={sloTarget}
              hasError={!field.valid && field.touched}
            >
              <PercentageFormInput
                form={form}
                id={sloTarget}
                fieldName={sloTarget}
                onChange={onChange}
                trackChange={debouncedTrackSloChanged}
              />
              <span className={locals.sloUnit}>%</span>
              <OverridingTextTouchedMessage
                field={form.get(sloTarget)}
                message={t('in-custom-dashboards:widgets.slo.formComponent.enterVal0to100')}
              />
            </Section>
          ))}
        </Sections>

        <Sections>
          <SelectInSection
            id="time-window-type"
            label={t('in-custom-dashboards:widgets.slo.formComponent.timeWindow')}
            value={timeWindowTypeValue}
            onChange={({ target }) => onChangeTimeWindowType(target.value)}
            actions={
              <HelpAction>
                <Trans
                  i18nKey="in-custom-dashboards:widgets.slo.formComponent.helpActionMsg1"
                  components={{ italic: <i />, bold: <strong /> }}
                />
                <br />
                <br />
                <Trans
                  i18nKey="in-custom-dashboards:widgets.slo.formComponent.helpActionMsg2"
                  components={{ italic: <i />, bold: <strong /> }}
                />
                <br />
                <br />
                <Trans
                  i18nKey="in-custom-dashboards:widgets.slo.formComponent.helpActionMsg3"
                  components={{ italic: <i />, bold: <strong /> }}
                />
              </HelpAction>
            }
          >
            <option value={fixed}>{t('in-custom-dashboards:widgets.slo.formComponent.fixTimeInterval')}</option>
            <option value={rolling}>{t('in-custom-dashboards:widgets.slo.formComponent.rollingTimeWindow')}</option>
            <option value={dynamic}>{t('in-custom-dashboards:widgets.slo.formComponent.dynamicTimeWindow')}</option>
          </SelectInSection>

          {(isRolling || isFixed) && (
            <Section
              title={t('in-custom-dashboards:widgets.slo.formComponent.length')}
              titleHtmlFor="time-window-size"
              useAlternateBg
            >
              <HorizontalFlexWrapper>
                {form.get(timeWindowDuration).map(field => (
                  <Input
                    id="time-window-size"
                    onChange={e =>
                      onChange([timeWindowDuration], field => field.setValue(e.target.value).setTouched(true))
                    }
                    hasError={!field.valid && field.touched}
                    value={field.value}
                    type="number"
                    step="1"
                    min="1"
                    max={getMaxTimeWindowDurationValue(timeWindowDurationUnitValue)}
                  />
                ))}

                {form.get(timeWindowDuration).map(field => (
                  <Select
                    hasError={!field.valid && field.touched}
                    value={timeWindowDurationUnitValue}
                    onChange={e => onChangeTimeDurationUnit(e.target.value)}
                    className={locals.timeWindowUnit}
                  >
                    <option value="days">{t('in-custom-dashboards:widgets.slo.formComponent.days')}</option>
                    <option value="weeks">{t('in-custom-dashboards:widgets.slo.formComponent.weeks')}</option>
                    <option value="months">{t('in-custom-dashboards:widgets.slo.formComponent.months')}</option>
                  </Select>
                ))}
              </HorizontalFlexWrapper>

              <TouchedMessages field={form.get(timeWindowDuration)} />
              <OverridingTextTouchedMessage
                field={form.get(timeWindowDuration)}
                message={t('in-custom-dashboards:widgets.slo.formComponent.pleaseSpecifyTheNumber', {
                  timeValue: timeWindowDurationUnitValue
                })}
              />
              <TouchedMessages field={form} />
            </Section>
          )}

          {isFixed && dateField && timeField && (
            <Section title={t('in-custom-dashboards:widgets.slo.formComponent.start')} useAlternateBg>
              <HorizontalFlexWrapper>
                <DateInput
                  value={dateField?.value}
                  onChange={v => onChange([timeWindowStart, 'date'], f => f.setValue(v).setTouched(true))}
                  hasError={!dateField.valid && dateField.touched}
                  iconType="lib_datetime_date"
                />

                {timeField && (
                  <Input
                    type="text"
                    value={timeField.value}
                    onBlur={({ target }) =>
                      onChange([timeWindowStart, 'time'], f =>
                        f.setValue(formatInputTime(target.value, 'HH:mm:ss')).setTouched(true)
                      )
                    }
                    onChange={({ target }) =>
                      onChange([timeWindowStart, 'time'], f => f.setValue(target.value).setTouched(true))
                    }
                    hasError={!timeField.valid && timeField.touched}
                    className={locals.timeInput}
                    iconType="lib_datetime_time"
                  />
                )}
              </HorizontalFlexWrapper>

              <OverridingTextTouchedMessage
                field={dateField}
                message={t('in-custom-dashboards:widgets.slo.formComponent.enterDateFormatYyyyMmDd')}
              />
              <OverridingTextTouchedMessage
                field={timeField}
                message={t('in-custom-dashboards:widgets.slo.formComponent.enterTimeInFormatHhMmSs')}
              />
            </Section>
          )}
        </Sections>
      </Stack>
    </Stack>
  );
}

function getMaxTimeWindowDurationValue(unit) {
  switch (unit) {
    case 'days':
      return 365;
    case 'weeks':
      return 52;
    case 'months':
    default:
      return 12;
  }
}

function getApplicationConfigObservable() {
  return getApplicationConfigsAsResultObservable().map(({ data }) => data);
}

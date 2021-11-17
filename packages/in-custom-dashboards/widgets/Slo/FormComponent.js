/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';
import { Stack } from '@instana/components';

import {
  sloTarget,
  timeWindowType,
  timeWindowDuration,
  timeWindowDurationUnit,
  timeWindowStart,
  entityId,
  entityType,
  getMaxTimeWindowDurationValue
} from 'in-custom-dashboards/widgets/Slo/form';
import {
  trackAPSelected,
  trackOpenSLIManagement,
  debouncedTrackSloChanged,
  trackStartEditingSloWidgetConfig,
  trackTimeWindowTypeChanged
} from 'in-custom-dashboards/widgets/Slo/tracker';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import MonitoringSourceSelector from 'in-custom-dashboards/widgets/Slo/components/MonitoringSourceSelector';
import ApplicationSelector from 'in-custom-dashboards/widgets/Slo/components/ApplicationSelector';
import formatInputTime from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import useSloFormSideEffects from 'in-custom-dashboards/widgets/Slo/hooks/useSloFormSideEffects';
import PercentageInput from 'in-custom-dashboards/widgets/Slo/components/PercentageInput';
import WebsiteSelector from 'in-custom-dashboards/widgets/Slo/components/WebsiteSelector';
import SliSelectionForm from 'in-custom-dashboards/widgets/Slo/components/SliSelector';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import SliManageList from 'in-custom-dashboards/widgets/Slo/sli/SliManageList';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { websiteSloEnabled } from 'in-services/featureFlags';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import DateInput from 'in-components/form/DateInput';
import Header from 'in-components/workspace/Header';
import Input from 'in-components/form/Input/Input';
import { Trans, t } from 'in-i18n';

import locals from './FormComponent.mless';

export default function FormComponent({ form, onChange: originalOnChange, setSlideInView }) {
  const [configChanged, setConfigChanged] = useState();
  const updateForm = useSloFormSideEffects(form, updatedForm => {
    if (!configChanged) {
      trackStartEditingSloWidgetConfig();
      setConfigChanged(true);
    }
    originalOnChange([], () => updatedForm);
  });

  const entityIdField = form.get(entityId);
  const entityIdValue = entityIdField?.value;
  const entityTypeValue = form.get(entityType)?.value;

  const timeWindowTypeValue = form.get(timeWindowType)?.value ?? 'dynamic';
  const isFixed = timeWindowTypeValue === 'fixed';
  const isRolling = timeWindowTypeValue === 'rolling';

  const onChangeTimeWindowType = value => {
    updateForm(form.updateIn([timeWindowType], f => f.setValue(value).setTouched(true)));
    trackTimeWindowTypeChanged({ type: value });
  };

  const timeWindowDurationUnitValue =
    form.get(timeWindowDurationUnit)?.value ?? t('in-custom-dashboards:widgets.slo.formComponent.weeks');

  const onChangeTimeDurationUnit = value => {
    updateForm(form.updateIn([timeWindowDurationUnit], f => f.setValue(value).setTouched(true)));
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
        return <SliManageList entityType={entityTypeValue} entityId={entityIdValue} subSlideState={subSlideState} />;
      }
    });
  }

  function onUpdateAppId(config) {
    updateForm(form.updateIn([entityId], f => f.setValue(config.id).setTouched(true)));
    trackAPSelected({ applicationId: config.id });
  }

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.slo.formComponent.sloConfig')}</Header>

      <Stack gap="xsmall">
        {websiteSloEnabled && (
          <Sections>
            <Section title={t('in-custom-dashboards:widgets.slo.formComponent.sloType')}>
              <MonitoringSourceSelector
                value={entityTypeValue}
                onChange={type =>
                  updateForm(form.updateIn([entityType], field => field.setValue(type).setTouched(true)))
                }
              />
            </Section>
          </Sections>
        )}

        {entityTypeValue === 'application' && (
          <ApplicationSelector apIdField={entityIdField} onChange={onUpdateAppId} />
        )}
        {entityTypeValue === 'website' && (
          <WebsiteSelector
            websiteIdField={entityIdField}
            onChange={id => updateForm(form.updateIn([entityId], field => field.setValue(id).setTouched(true)))}
          />
        )}

        <SliSelectionForm
          form={form}
          entityType={entityTypeValue}
          entityId={entityIdValue}
          updateForm={updateForm}
          openManageSLIComponent={
            <Button
              disabled={!entityIdValue}
              kind="primary"
              onClick={() => {
                activateManageSliSlideIn();
                trackOpenSLIManagement({ entityId: entityIdValue });
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
              <PercentageInput
                id={sloTarget}
                value={field.value}
                onChange={value => {
                  updateForm(form.updateIn([sloTarget], f => f.setValue(value).setTouched(true)));
                  debouncedTrackSloChanged(value);
                }}
                hasError={!field.valid && field.touched}
              />
              <span className={locals.sloUnit}>%</span>
              <OverridingFieldValidationMessage
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
            <option value="fixed">{t('in-custom-dashboards:widgets.slo.formComponent.fixTimeInterval')}</option>
            <option value="rolling">{t('in-custom-dashboards:widgets.slo.formComponent.rollingTimeWindow')}</option>
            <option value="dynamic">{t('in-custom-dashboards:widgets.slo.formComponent.dynamicTimeWindow')}</option>
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
                      updateForm(
                        form.updateIn([timeWindowDuration], field => field.setValue(e.target.value).setTouched(true))
                      )
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
              <OverridingFieldValidationMessage
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
                  onChange={v =>
                    updateForm(form.updateIn([timeWindowStart, 'date'], f => f.setValue(v).setTouched(true)))
                  }
                  hasError={!dateField.valid && dateField.touched}
                  iconType="lib_datetime_date"
                />

                {timeField && (
                  <Input
                    type="text"
                    value={timeField.value}
                    onBlur={({ target }) =>
                      updateForm(
                        form.updateIn([timeWindowStart, 'time'], f =>
                          f.setValue(formatInputTime(target.value, 'HH:mm:ss')).setTouched(true)
                        )
                      )
                    }
                    onChange={({ target }) =>
                      updateForm(
                        form.updateIn([timeWindowStart, 'time'], f => f.setValue(target.value).setTouched(true))
                      )
                    }
                    hasError={!timeField.valid && timeField.touched}
                    className={locals.timeInput}
                    iconType="lib_datetime_time"
                  />
                )}
              </HorizontalFlexWrapper>

              <OverridingFieldValidationMessage
                field={dateField}
                message={t('in-custom-dashboards:widgets.slo.formComponent.enterDateFormatYyyyMmDd')}
              />
              <OverridingFieldValidationMessage
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

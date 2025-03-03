/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { Field, MapForm } from 'formalistic';

import { Stack, Button, Select } from '@instana/components';

import {
  entityId,
  entityType,
  getMaxTimeWindowDurationValue,
  sliConfigId,
  sloTarget,
  timeWindowDuration,
  TimeWindowDuration,
  timeWindowDurationUnit,
  timeWindowStart,
  timeWindowType,
  TimeWindowType
} from 'in-custom-dashboards/widgets/SloLegacy/form';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';
import { SLI_MANAGEMENT_EXIT, SLI_MANAGEMENT_VIEW, SLO_WIDGET_EDIT_START } from 'in-services/tracking/eventNames';
import MonitoringSourceSelector from 'in-custom-dashboards/widgets/SloLegacy/components/MonitoringSourceSelector';
import ApplicationSelector from 'in-custom-dashboards/widgets/SloLegacy/components/ApplicationSelector';
import FormComponentHeader from 'in-custom-dashboards/widgets/SloLegacy/components/FormComponentHeader';
import useSloFormSideEffects from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSloFormSideEffects';
import SliManageList from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliManageList';
import { SlideInViewConfig } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import formatInputTime from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import WebsiteSelector from 'in-custom-dashboards/widgets/SloLegacy/components/WebsiteSelector';
import SliSelector from 'in-custom-dashboards/widgets/SloLegacy/components/SliSelector';
import { isWebsiteSloEnabled } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import { SLO_TARGET_DECIMAL_PRECISION } from 'in-service-levels/constants';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import HelpAction from 'in-components/workspace/HelpAction';
import { pageNames } from 'in-services/tracking/pageNames';
import { ENDED_PROCESS } from 'in-services/util/constants';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import DateInput from 'in-components/form/DateInput';
import Input from 'in-components/form/Input/Input';
import { Nullish } from 'in-types';
import { t, Trans } from 'in-i18n';

import locals from './SloFormComponent.mless';

export interface FormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: MapForm<any>) => MapForm<any>) => void;
  setSlideInView: (view: SlideInViewConfig<'CREATE' | 'EDIT' | undefined>) => void;
}

export default function FormComponent({ form, onChange: originalOnChange, setSlideInView }: FormComponentProps) {
  const [configChanged, setConfigChanged] = useState<boolean>();
  const updateForm = useSloFormSideEffects(form, updatedForm => {
    if (!configChanged) {
      setConfigChanged(true);
    }
    originalOnChange([], () => updatedForm as MapForm<any>);
  });

  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  useEffect(() => {
    trackCta(SLO_WIDGET_EDIT_START, undefined);
  }, [trackCta]);

  const entityIdField = form.get(entityId) as Field<string>;
  const entityIdValue = entityIdField?.value;
  const entityTypeValue = (form.get(entityType) as Field<SliType>)?.value;

  const timeWindowTypeValue = (form.get(timeWindowType) as Field<TimeWindowType>)?.value ?? 'dynamic';
  const isFixed = timeWindowTypeValue === 'fixed';
  const isRolling = timeWindowTypeValue === 'rolling';

  const onChangeTimeWindowType = (value: TimeWindowType) => {
    updateForm(form.updateIn([timeWindowType], f => (f as Field<TimeWindowType>).setValue(value).setTouched(true)));
  };

  const timeWindowDurationUnitValue =
    (form.get(timeWindowDurationUnit) as Field<TimeWindowDuration>)?.value ??
    t('in-custom-dashboards:widgets.slo.formComponent.weeks');

  const onChangeTimeDurationUnit = (value: TimeWindowDuration): void => {
    updateForm(
      form.updateIn([timeWindowDurationUnit], f => (f as Field<TimeWindowDuration>).setValue(value).setTouched(true))
    );
  };
  const dateField = (form.get(timeWindowStart) as MapForm<any>)?.get('date') as Field<string>;
  const timeField = (form.get(timeWindowStart) as MapForm<any>)?.get('time') as Field<string>;

  function activateManageSliSlideIn() {
    trackCta(SLI_MANAGEMENT_VIEW, {
      entityType: entityTypeValue
    });
    return setSlideInView({
      renderTitle(showCreateFormState) {
        if (!showCreateFormState) {
          return t('in-custom-dashboards:widgets.slo.formComponent.sliManagement');
        }
        return showCreateFormState === 'EDIT'
          ? t('in-custom-dashboards:widgets.slo.formComponent.editSli')
          : t('in-custom-dashboards:widgets.slo.formComponent.createSli');
      },
      slideOutHandler(slideOut, [showCreateFormState, setShowCreateFormState]) {
        if (showCreateFormState) return () => setShowCreateFormState(undefined);
        return () => {
          unstable_trackEvent(ENDED_PROCESS, {
            entityType: entityTypeValue,
            objectType: SLI_MANAGEMENT_EXIT
          });
          slideOut();
        };
      },
      getContent({ slideOut, subSlideState: [showCreateFormState, setShowCreateFormState] }) {
        return (
          <>
            <ViewTrackingMeta
              data={{ productArea: productAreas.custom_dashboard, pageRootName: pageNames.custom_dashboard }}
            />
            <SliManageList
              entityType={entityTypeValue}
              entityId={entityIdValue}
              onChange={value => {
                // It is important to call slideOut() before onChange(), otherwise
                // the new state of the form will be overwritten by an old state
                slideOut();
                if (value?.id) {
                  updateForm(
                    form.updateIn([sliConfigId], field => (field as Field<string>).setValue(value.id!).setTouched(true))
                  );
                }
              }}
              showCreateForm={Boolean(showCreateFormState)}
              onShowCreateForm={isEditing => setShowCreateFormState(isEditing ? 'EDIT' : 'CREATE')}
              onCloseCreateForm={() => setShowCreateFormState(undefined)}
            />
          </>
        );
      }
    });
  }

  function onUpdateAppId(id: string | undefined): void {
    updateForm(form.updateIn([entityId], f => (f as Field<string | undefined>).setValue(id).setTouched(true)));
  }

  const isWebsiteEntityType = entityTypeValue === 'website';

  return (
    <Stack gap="normal">
      <FormComponentHeader />

      <Stack gap="xsmall">
        {isWebsiteSloEnabled && (
          <Sections>
            <Section title={t('in-custom-dashboards:widgets.slo.formComponent.sloType')}>
              <MonitoringSourceSelector
                value={entityTypeValue}
                onChange={type =>
                  updateForm(
                    form.updateIn([entityType], field => (field as Field<SliType>).setValue(type).setTouched(true))
                  )
                }
              />
            </Section>
          </Sections>
        )}

        {entityTypeValue === 'application' && (
          <ApplicationSelector apIdField={entityIdField} onChange={onUpdateAppId} />
        )}
        {isWebsiteEntityType && (
          <WebsiteSelector
            websiteIdField={entityIdField}
            onChange={id =>
              updateForm(form.updateIn([entityId], field => (field as Field<string>).setValue(id).setTouched(true)))
            }
          />
        )}

        <SliSelector
          form={form}
          entityType={entityTypeValue}
          entityId={entityIdValue}
          updateForm={updateForm}
          openManageSLIComponent={
            <Button disabled={!entityIdValue} kind="primary" onClick={activateManageSliSlideIn}>
              {t('in-custom-dashboards:widgets.slo.formComponent.manageSlIs')}
            </Button>
          }
        />

        <Sections>
          {(form.get(sloTarget) as Field<number | undefined>).map(field => (
            <Section
              title={t('in-custom-dashboards:widgets.slo.formComponent.sloTarget')}
              titleHtmlFor={sloTarget}
              hasError={!field.valid && field.touched}
            >
              <Stack direction="horizontal" gap="xxsmall">
                <div className={locals.sloInput}>
                  <PercentageInput
                    className={locals.sloInput}
                    id={sloTarget}
                    value={field.value}
                    onChange={value => {
                      updateForm(
                        form.updateIn([sloTarget], f =>
                          (f as Field<number | undefined>).setValue(value).setTouched(true)
                        )
                      );
                    }}
                    hasError={!field.valid && field.touched}
                    decimalPrecision={SLO_TARGET_DECIMAL_PRECISION}
                  />
                </div>
                <div className={locals.sloUnit}>%</div>
              </Stack>
              <OverridingFieldValidationMessage
                field={form.get(sloTarget)!}
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
            onChange={({ target }) => onChangeTimeWindowType(target.value as TimeWindowType)}
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
                {(form.get(timeWindowDuration) as Field<number>).map(field => (
                  <Input
                    id="time-window-size"
                    onChange={e =>
                      updateForm(
                        form.updateIn([timeWindowDuration], f =>
                          (f as Field<number>).setValue(e.target.valueAsNumber).setTouched(true)
                        )
                      )
                    }
                    hasError={!field.valid && field.touched}
                    value={field.value ?? ''}
                    type="number"
                    step="1"
                    min="1"
                    max={getMaxTimeWindowDurationValue(timeWindowDurationUnitValue)}
                  />
                ))}

                {(form.get(timeWindowDuration) as Field<number>).map(field => (
                  <Select
                    hasError={!field.valid && field.touched}
                    value={timeWindowDurationUnitValue}
                    onChange={e => onChangeTimeDurationUnit(e.target.value as TimeWindowDuration)}
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
                field={form.get(timeWindowDuration)!}
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
                    updateForm(
                      form.updateIn([timeWindowStart, 'date'], f =>
                        (f as Field<string | Nullish>).setValue(v).setTouched(true)
                      )
                    )
                  }
                  iconType="lib_datetime_date"
                />

                {timeField && (
                  <Input
                    type="text"
                    value={timeField.value}
                    onBlur={({ target }) =>
                      updateForm(
                        form.updateIn([timeWindowStart, 'time'], f =>
                          (f as Field<string>).setValue(formatInputTime(target.value, 'HH:mm:ss')).setTouched(true)
                        )
                      )
                    }
                    onChange={({ target }) =>
                      updateForm(
                        form.updateIn([timeWindowStart, 'time'], f =>
                          (f as Field<string>).setValue(target.value).setTouched(true)
                        )
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

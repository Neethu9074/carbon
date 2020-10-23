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
  rolling
} from 'in-custom-dashboards/widgets/Slo/form';
import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { PercentageFormInput } from 'in-custom-dashboards/widgets/Slo/components/PercentageFormInput';
import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import SliSelectionForm from 'in-custom-dashboards/widgets/Slo/components/SliSelectionForm';
import APConfigSelector from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import FormInputField from 'in-custom-dashboards/widgets/Slo/components/FormInputField';
import FormDropDown from 'in-custom-dashboards/widgets/Slo/components/FormDropDown';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import SliManageList from 'in-custom-dashboards/widgets/Slo/SliManageList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { evaluateClassNames } from 'in-services/util/classnames';
import { Row, Col } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import DateInput from 'in-components/form/DateInput';
import HelpText from 'in-components/form/HelpText';
import useObservable from 'in-hooks/useObservable';
import Input from 'in-components/form/Input';
import Button from 'in-new-components/Button';

import locals from './FormComponent.mless';

export default function FormComponent({ form, onChange, widgetTitleFormGroup, setSlideInView, widgetPreview }) {
  const [apConfig, setApConfig] = useState();
  const apConfigs = useObservable(getApplicationConfigObservable, []);

  const apConfigIdField = form.get(apConfigId);
  const appConfigIdValue = apConfigIdField?.value;
  if (apConfigs && !apConfig) {
    // initial setting
    const newApConfig = apConfigs.find(apConfig => apConfig.id === appConfigIdValue);
    if (newApConfig !== apConfig) setApConfig(newApConfig);
  }

  const sloTargetValue = form.get(sloTarget)?.value;
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
  };

  const timeWindowDurationUnitValue = form.get(timeWindowDurationUnit)?.value ?? 'weeks';

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
          return 'SLI Management';
        }
        return sliSelected?.id ? 'Edit SLI' : 'Create SLI';
      },
      slideOutHandler(slideOut, [sliSelected, selectSli]) {
        return () => {
          if (sliSelected == null) {
            slideOut();
          } else {
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
    onChange([], formField => formField.updateIn([apConfigId], f => f.setValue(apId).setTouched(true)));
  }

  return (
    <div
      className={evaluateClassNames({
        [locals.main]: true,
        [locals['spacing-medium']]: true
      })}
    >
      <StackItem>
        <Header>Customize the Widget</Header>
        {widgetTitleFormGroup}
      </StackItem>
      <Header>SLO Configuration</Header>
      <StackItem>
        <APConfigSelector
          apConfigIdField={apConfigIdField}
          apConfigs={apConfigs}
          onUpdateApConfigId={onUpdateApConfigId}
        />
      </StackItem>
      <StackItem>
        <SliSelectionForm
          form={form}
          applicationId={appConfigIdValue}
          onChange={onChange}
          widgetPreview={false}
          widgetTitleFormGroup={widgetTitleFormGroup}
          openManageSLIComponent={
            <Button disabled={!apConfig} kind="primary" onClick={() => activateManageSliSlideIn()}>
              Manage SLIs
            </Button>
          }
        />
      </StackItem>
      <StackItem>
        <Row>
          <Col md={2}>
            <FormGroup withoutBottomMargin>
              <KeyValue value="SLO Target" inverted className={locals.oneLineLabel} />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup withoutBottomMargin className={locals.inRow}>
              <PercentageFormInput value={sloTargetValue} onChange={onChange} form={form} fieldName={sloTarget} />
              <span className={locals.sloUnit}>%</span>
            </FormGroup>
          </Col>
          <Col mdOffset={2} md={10}>
            <OverridingTextTouchedMessage
              field={form.get(sloTarget)}
              message="Please enter a value between 0 and 100."
            />
          </Col>
        </Row>
      </StackItem>
      <StackItem>
        <Row>
          <Col md={2}>
            <FormGroup withoutBottomMargin>
              <KeyValue value="Time Window Type" inverted className={locals.oneLineLabel} />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              <FormDropDown
                value={timeWindowTypeValue}
                options={[
                  { value: fixed, label: 'Fixed time interval' },
                  { value: rolling, label: 'Rolling time window' },
                  { value: dynamic, label: 'Dynamic time window' }
                ]}
                onChange={({ target }) => onChangeTimeWindowType(target.value)}
              />
            </FormGroup>
          </Col>
          <Col mdOffset={2} md={10} className={locals.withoutMarginTop}>
            <HelpText className={locals.windowHelpText}>
              <strong>Fixed time interval:</strong> A time window with a defined start and duration. Eg. monthly
              starting 2020-01-01. The last partial time interval for the time selection from the global time picker
              will be displayed.
              <br />
              <br />
              <strong>Rolling time window:</strong> A time window with a defined duration, where the end is defined by
              the global time picker’s right hand date/time selection, eg. last 2 weeks.
              <br />
              <br />
              <strong>Dynamic time window:</strong> The SLO is calculated for the time window selected in the global
              time picker.
            </HelpText>
          </Col>
        </Row>
        {(isRolling || isFixed) && (
          <>
            <Row>
              <Col md={2}>
                <FormGroup withoutBottomMargin>
                  <KeyValue value="Time Window Size" inverted className={locals.oneLineLabel} />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup withoutBottomMargin>
                  {form.get(timeWindowDuration).map(() => (
                    <FormInputField
                      form={form}
                      onChange={(paths, field) => {
                        onChange([], form => form.setTouched(true).updateIn(paths, field));
                      }}
                      fieldName={timeWindowDuration}
                      type="number"
                      step="1"
                      min="1"
                      max={getMaxTimeWindowDurationValue(timeWindowDurationUnitValue)}
                    />
                  ))}
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup withoutBottomMargin>
                  <FormDropDown
                    value={timeWindowDurationUnitValue}
                    options={[
                      { value: 'days', label: 'days' },
                      { value: 'weeks', label: 'weeks' },
                      { value: 'months', label: 'months' }
                    ]}
                    onChange={({ target }) => onChangeTimeDurationUnit(target.value)}
                  />
                </FormGroup>
              </Col>
              <Col mdOffset={2} md={12}>
                <OverridingTextTouchedMessage
                  field={form.get(timeWindowDuration)}
                  message={`Please specify the number of ${timeWindowDurationUnitValue}.`}
                />
                <TouchedMessages field={form} />
              </Col>
            </Row>
          </>
        )}
        {isFixed && dateField && timeField && (
          <Row>
            <Col md={2}>
              <FormGroup withoutBottomMargin>
                <KeyValue value="Time Window Start" inverted className={locals.oneLineLabel} />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup withoutBottomMargin className={locals.inRow}>
                <DateInput
                  value={dateField?.value}
                  onChange={v => onChange([timeWindowStart, 'date'], f => f.setValue(v).setTouched(true))}
                  hasError={!dateField?.valid && dateField?.touched}
                  className={locals.field}
                  iconType="lib_datetime_date"
                />
              </FormGroup>
            </Col>
            <Col md={8}>
              <FormGroup withoutBottomMargin className={locals.inRow}>
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
                    className={locals.field}
                    iconType="lib_datetime_time"
                  />
                )}
              </FormGroup>
            </Col>
            <Col mdOffset={2} md={2}>
              <OverridingTextTouchedMessage field={dateField} message="Please enter a date in the format YYYY-MM-DD." />
            </Col>
            <Col md={2}>
              <OverridingTextTouchedMessage field={timeField} message="Please enter a time in the format HH:mm:ss." />
            </Col>
          </Row>
        )}
      </StackItem>
      <div className={locals.previewContainer}>{widgetPreview}</div>
    </div>
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

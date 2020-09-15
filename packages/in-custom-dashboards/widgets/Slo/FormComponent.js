import React from 'react';

import {
  SloTarget,
  ApConfigId,
  ApName,
  ApBoundaryScope,
  TimeWindowType,
  TimeWindowDuration,
  TimeWindowDurationUnit,
  TimeWindowStart,
  removeFormForStartTimeStamp,
  addFormForStartTimeStamp,
  removeFormForTimeDuration,
  addFormForTimeDuration,
  Dynamic,
  Fixed,
  Rolling
} from 'in-custom-dashboards/widgets/Slo/form';
import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { PercentageFormInput } from 'in-custom-dashboards/widgets/Slo/components/PercentageFormInput';
import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import SliFormComponent from 'in-custom-dashboards/widgets/Slo/components/SliSelectionForm';
import APConfigSelector from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import FormInputField from 'in-custom-dashboards/widgets/Slo/components/FormInputField';
import FormDropDown from 'in-custom-dashboards/widgets/Slo/components/FormDropDown';
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
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import locals from './FormComponent.mless';

export default function FormComponent({ form, onChange, widgetTitleFormGroup, setSlideInView, widgetPreview, api }) {
  const apConfigId = form.get(ApConfigId)?.value;
  const sloTarget = form.get(SloTarget)?.value;
  const timeWindowTypeValue = form.get(TimeWindowType)?.value ?? Dynamic;
  const isFixed = timeWindowTypeValue === Fixed;
  const isRolling = timeWindowTypeValue === Rolling;

  const onChangeTimeWindowType = value => {
    onChange([], form => {
      let updatedForm;
      if (value === Fixed) {
        updatedForm = addFormForStartTimeStamp(form);
        updatedForm = addFormForTimeDuration(updatedForm, {}, false);
      } else {
        updatedForm = removeFormForStartTimeStamp(form);
        if (value === Dynamic) {
          updatedForm = removeFormForTimeDuration(updatedForm);
        } else {
          updatedForm = addFormForTimeDuration(updatedForm, {}, false);
        }
      }
      return updatedForm.updateIn([TimeWindowType], f => f.setValue(value).setTouched(true));
    });
  };

  const timeWindowDurationUnitValue = form.get(TimeWindowDurationUnit)?.value ?? 'weeks';

  const onChangeTimeDurationUnit = value => {
    onChange([], form => {
      const oldDuration = form.get(TimeWindowDuration).value;
      const maxDurationForThisUnit = getMaxTimeWindowDurationValue(value);
      return form
        .updateIn([TimeWindowDurationUnit], f => f.setValue(value).setTouched(true))
        .updateIn([TimeWindowDuration], f =>
          f.setValue(Math.min(oldDuration, maxDurationForThisUnit)).setTouched(true)
        );
    });
  };
  const dateField = form.get(TimeWindowStart)?.get('date');
  const timeField = form.get(TimeWindowStart)?.get('time');

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
            applicationId={apConfigId}
            apName={form.get(ApName)?.value}
            apDefaultBoundaryScope={form.get(ApBoundaryScope)?.value}
            api={api}
            subSlideState={subSlideState}
          />
        );
      }
    });
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
        <APConfigSelector form={form} onChange={onChange} api={api} />
      </StackItem>
      <StackItem>
        <SliFormComponent
          form={form}
          apConfigId={apConfigId}
          onChange={onChange}
          api={api}
          widgetPreview={false}
          widgetTitleFormGroup={widgetTitleFormGroup}
          openManageSLIComponent={
            <Button disabled={!apConfigId} kind={'primary'} onClick={() => activateManageSliSlideIn()}>
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
              <PercentageFormInput value={sloTarget} onChange={onChange} form={form} fieldName={SloTarget} />
              <span className={locals.sloUnit}>%</span>
            </FormGroup>
          </Col>
          <Col mdOffset={2} md={10}>
            <OverridingTextTouchedMessage
              field={form.get(SloTarget)}
              message="Please enter a time in the format HH:mm:ss."
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
                  { value: Fixed, label: 'Fixed time interval' },
                  { value: Rolling, label: 'Rolling time window' },
                  { value: Dynamic, label: 'Dynamic time window' }
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
                  {form.get(TimeWindowDuration).map(() => (
                    <FormInputField
                      form={form}
                      onChange={(paths, field) => {
                        onChange([], form => form.setTouched(true).updateIn(paths, field));
                      }}
                      fieldName={TimeWindowDuration}
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
                  field={form.get(TimeWindowDuration)}
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
                  onChange={v => onChange([TimeWindowStart, 'date'], f => f.setValue(v).setTouched(true))}
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
                      onChange([TimeWindowStart, 'time'], f =>
                        f.setValue(formatInputTime(target.value, 'HH:mm:ss')).setTouched(true)
                      )
                    }
                    onChange={({ target }) =>
                      onChange([TimeWindowStart, 'time'], f => f.setValue(target.value).setTouched(true))
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

function getMaxTimeWindowDurationValue(timeWindowDurationUnit) {
  switch (timeWindowDurationUnit) {
    case 'days':
      return 365;
    case 'weeks':
      return 52;
    case 'months':
    default:
      return 12;
  }
}

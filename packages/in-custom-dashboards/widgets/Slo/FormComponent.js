import React from 'react';

import {
  SloTarget,
  SliApConfigId,
  SloApName,
  TimeWindowType,
  TimeWindowDuration,
  TimeWindowDurationUnit,
  TimeWindowStart,
  removeFormForStartTimeStamp,
  addFormForStartTimeStamp,
  Dynamic,
  Fixed,
  Rolling
} from 'in-custom-dashboards/widgets/Slo/form';
import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import SliFormComponent from 'in-custom-dashboards/widgets/Slo/components/SliSelectionForm';
import APConfigSelector from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
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
  const apConfigId = form.get(SliApConfigId)?.value;
  const sloTarget = form.get(SloTarget)?.value;
  const timeWindowTypeValue = form.get(TimeWindowType)?.value ?? Dynamic;
  const isFixed = timeWindowTypeValue === Fixed;
  const isRolling = timeWindowTypeValue === Rolling;

  const onChangeTimeWindowType = value => {
    onChange([], form => {
      let updatedForm;
      if (value === Fixed) {
        const now = new Date().getTime();
        updatedForm = addFormForStartTimeStamp(form, now);
      } else {
        updatedForm = removeFormForStartTimeStamp(form);
      }
      return updatedForm.updateIn([TimeWindowType], f => f.setValue(value).setTouched(true));
    });
  };

  const timeWindowDurationUnitValue = form.get(TimeWindowDurationUnit)?.value ?? 'm';

  const onChangeTimeDurationUnit = value => {
    onChange([TimeWindowDurationUnit], f => f.setValue(value).setTouched(true));
  };
  const dateField = form.get(TimeWindowStart)?.get('date');
  const timeField = form.get(TimeWindowStart)?.get('time');

  function activateManageSliSlideIn() {
    return setSlideInView({
      renderTitle(sliSelected) {
        return sliSelected === null ? 'Sli Management' : sliSelected?.id ? 'Edit SLI' : 'Create SLI';
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
            apName={form.get(SloApName)?.value}
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
              <Input
                value={
                  typeof sloTarget === 'number'
                    ? parseFloat(Number.parseFloat(sloTarget * 100).toPrecision(6))
                    : sloTarget
                }
                type="number"
                onChange={({ target }) => {
                  const value = target.value;
                  onChange([SloTarget], f =>
                    f
                      .setValue(value ? parseFloat(Number.parseFloat(target.valueAsNumber / 100).toPrecision(6)) : '')
                      .setTouched(true)
                  );
                }}
                hasError={!form.get(SloTarget).valid && form.get(SloTarget).touched}
                min={0}
                max={99.999}
                step="any"
              />
              <span className={locals.sloUnit}>%</span>
            </FormGroup>
          </Col>
          <Col mdOffset={2} md={10}>
            <TouchedMessages field={form.get(SloTarget)} />
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
              <DropDownMock
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
          <Col xsOffset={2} xs={10} style={{ marginTop: 0 }}>
            <HelpText>
              <strong>Fixed time interval:</strong>
              <br />
              <br />A time window with a defined start and duration. Eg. monthly starting 2020-01-01. The last partial
              time interval for the time selection from the global time picker will be displayed.
            </HelpText>
            <HelpText>
              <strong>Rolling time window:</strong>
              <br />
              <br />A time window with a defined duration, where the end is defined by the global time picker’s right
              hand date/time selection, eg. last 2 weeks.
            </HelpText>
            <HelpText>
              <strong>Dynamic time window:</strong>
              <br />
              <br />
              The SLO is calculated for the time window selected in the global time picker.
            </HelpText>
          </Col>
        </Row>
        {(isRolling || isFixed) && (
          <Row>
            <Col md={2}>
              <FormGroup withoutBottomMargin>
                <KeyValue value="Time Window Size" inverted className={locals.oneLineLabel} />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup withoutBottomMargin>
                <InputMock form={form} onChange={onChange} fieldName={TimeWindowDuration} />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup withoutBottomMargin>
                <DropDownMock
                  value={timeWindowDurationUnitValue}
                  options={[
                    { value: 'months', label: 'months' },
                    { value: 'weeks', label: 'weeks' },
                    { value: 'days', label: 'days' }
                  ]}
                  onChange={({ target }) => onChangeTimeDurationUnit(target.value)}
                />
              </FormGroup>
            </Col>
            <Col mdOffset={2} md={12}>
              <TouchedMessages field={form.get(TimeWindowDuration)} />
            </Col>
          </Row>
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
            <Col md={2}>
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
            <Col mdOffset={2} md={12}>
              {dateField && <TouchedMessages field={dateField} />}
              {timeField && <TouchedMessages field={timeField} />}
            </Col>
          </Row>
        )}
      </StackItem>
      <div className={locals.previewContainer}>{widgetPreview}</div>
    </div>
  );
}

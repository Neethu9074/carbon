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
import { round } from 'in-new-components/Alerting/utils/formatUtils';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import DateInput from 'in-components/form/DateInput';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import locals from 'in-new-components/time/TimeSelectionDialogPresenter/DateTimeInput.mless';

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

  return (
    <>
      <Stack space="large">
        <StackItem>
          <Header>Customize the Widget</Header>
          {widgetTitleFormGroup}
        </StackItem>

        <StackItem>
          <Header>SLO Configuration</Header>
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
              <Button
                disabled={!apConfigId}
                kind={'primary'}
                onClick={() =>
                  setSlideInView({
                    title: 'Sli Management',
                    getContent() {
                      return <SliManageList applicationId={apConfigId} apName={form.get(SloApName)?.value} api={api} />;
                    }
                  })
                }
              >
                Manage SLIs
              </Button>
            }
          />
        </StackItem>
        <StackItem>
          <Row>
            <Col md={2}>
              <FormGroup>
                <KeyValue value="SLO Target" inverted />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Input
                  value={sloTarget !== null && sloTarget !== '' ? sloTarget * 100 : ''}
                  onChange={({ target }) => {
                    const value = target.value ?? '';
                    onChange([SloTarget], f =>
                      f.setValue(value === '' ? '' : round(Math.abs(value) / 100, 3)).setTouched(true)
                    );
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </StackItem>
        <StackItem>
          <Row>
            <Col md={2}>
              <FormGroup>
                <KeyValue value="Time Window Type" inverted />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
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
            <Col xs={12}>
              <Message
                small
                bold
                withIcon
                title="Fixed time interval"
                description="A time window with a defined start and duration. Eg. monthly starting 2020-01-01. The last partial time interval for the time selection from the global time picker will be displayed."
              />
              <Message
                small
                bold
                withIcon
                title="Rolling time window"
                description="A time window with a defined duration, where the end is defined by the global time picker’s right hand date/time selection, eg. last 2 weeks."
              />
              <Message
                small
                bold
                withIcon
                title="Dynamic time window"
                description="The SLO is calculated for the time window selected in the global time picker."
              />
            </Col>
          </Row>
          {(isRolling || isFixed) && (
            <Row>
              <Col md={2}>
                <FormGroup>
                  <KeyValue value="Time Window Size" inverted />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <InputMock form={form} onChange={onChange} fieldName={TimeWindowDuration} />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
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
            </Row>
          )}
          {isFixed && dateField && timeField && (
            <Row>
              <Col md={2}>
                <FormGroup>
                  <KeyValue value="Time Window Start" inverted />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <DateInput
                      value={dateField?.value}
                      onChange={v => onChange([TimeWindowStart, 'date'], f => f.setValue(v).setTouched(true))}
                      hasError={!dateField?.valid && dateField?.touched}
                      className={locals.field}
                    />
                    <SvgIcon type="lib_datetime_date" />
                  </div>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
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
                      />
                    )}

                    <SvgIcon type="lib_datetime_time" />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          )}
        </StackItem>
        <StackItem>{widgetPreview}</StackItem>
      </Stack>
    </>
  );
}

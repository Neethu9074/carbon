import React, { useState } from 'react';

import InboundOrAllCallsOption from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import { ruleAggregationOptions } from 'in-applications/alerting/form/ruleFormData';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import { createMapForm, createField } from 'formalistic';
import { demo } from 'in-custom-dashboards/widgets/Slo';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import { noop } from 'in-services/util/function';
import Header from 'in-components/form/Header';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

function createSliTypeForm(sliEntity) {
  let sliEntityForm = createMapForm()
    .put(
      'sliType',
      createField({
        value: sliEntity.sliType ?? null
      })
    )
    .put(
      'applicationId',
      createField({
        value: sliEntity.applicationId
      })
    )
    .put(
      'serviceId',
      createField({
        value: sliEntity.serviceId ?? null
      })
    )
    .put(
      'endpointId',
      createField({
        value: sliEntity.endpointId ?? null
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: sliEntity.boundaryScope ?? null
      })
    );
  return sliEntityForm;
}

function createForm(savedState) {
  let form = createMapForm();

  form = form.put(
    'sliName',
    createField({
      value: savedState['sliName'] ?? demo['sliName'] ?? all_services_mock
    })
  ); // TODO map with saved-state / sliEntity

  const sliEntity = savedState?.sliEntity ?? {};
  const sliEntityForm = createSliTypeForm(sliEntity);
  form = form.put('sliEntity', sliEntityForm);

  if (savedState.metricConfiguration) {
    form = form.put('metricConfiguration', createMetricsForm(savedState.metricConfiguration));
  }
  return form;
}

function resetFormForSliType(sliType, setForm, form, sliConfig) {
  if (sliType === 'application') {
    setForm(form.put('metricConfiguration', createMetricsForm(sliConfig.metricConfiguration ?? {})));
  } else {
    setForm(form.remove('metricConfiguration'));
  }
}

export default function CreateNewSLIForm({
  apName,
  sliConfig
  //form,
  // onChange,
  // onChangeType
}) {
  const [form, setForm] = useState(createForm(sliConfig ?? {}));

  const onChange = (path, fn) => {
    setForm(form.updateIn(path, fn));
  };
  const onChangeType = sliType => {
    let updatedForm = form.updateIn(['sliEntity', 'sliType'], f => f.setValue(sliType).setTouched(true));
    resetFormForSliType(sliType, setForm, updatedForm, sliConfig);
  };

  const sliEntityForm = form.get('sliEntity');
  const boundaryScope = sliEntityForm?.get('boundaryScope')?.value;
  const updateBoundaryScope = value => {
    onChange(['sliEntity', 'boundaryScope'], f => f.setValue(value).setTouched(true));
  };
  const sliType = sliEntityForm.get('sliType').value;

  return (
    <Stack space="medium">
      <StackItem>
        <Header>SLI Customization</Header>
      </StackItem>
      <StackItem>
        <Row>
          <Col md={2}>
            <FormGroup>
              <Label>Name</Label>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <InputMock form={form} onChange={onChange} fieldName="sliName" />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <FormGroup>
              <Label>Type: {sliType}</Label>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <DropDownMock
                value={sliType}
                onChange={({ target }) => onChangeType(target.value)}
                options={[
                  { value: '', label: 'Please select' },
                  { value: 'application', label: 'Time-based' },
                  { value: 'availability', label: 'Event-based', description: 'e.g. availability' }
                ]}
              />
            </FormGroup>
          </Col>
        </Row>
      </StackItem>
      <StackItem>
        <Header>SLI Entity</Header>
        <Row>
          <Col md={2}>
            <FormGroup>
              <Label>Application Perspective</Label>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Input disabled value={apName} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <FormGroup>
              <Label>Boundary</Label>
            </FormGroup>
          </Col>
          <Col md={5}>
            <InboundOrAllCallsOption
              boundaryScope={boundaryScope}
              onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.inbound)}
              scope={boundaryScopes.inbound}
            />
          </Col>
          <Col md={5} mdOffset={2}>
            <InboundOrAllCallsOption
              boundaryScope={boundaryScope}
              onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.all)}
              scope={boundaryScopes.all}
            />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <FormGroup>
              <Label>Service</Label>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <DropDownMock options={[{ value: '', label: 'All Services' }]} value={''} onChange={noop} />
              {false && <DropDownMock options={[{ value: '', label: 'Please select' }]} value={null} />}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <FormGroup>
              <Label>Endpoints</Label>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <DropDownMock options={[{ value: '', label: 'All Endpoints' }]} value={''} onChange={noop} />
              {false && <DropDownMock options={[{ value: '', label: 'Please select' }]} value={null} />}
            </FormGroup>
          </Col>
        </Row>
      </StackItem>
      <MetricsForm form={form} onChange={onChange} />
      {sliType === 'availability' && <EventBasedForm form={form} />}
    </Stack>
  );
}
const EventBasedForm = () => {
  return (
    <StackItem>
      <Header>Good Events</Header>
      {<TagFilterConfiguration tagFilters={[]} onChange={noop()} timeConfig={{}} />}
      <Header>Bad Events</Header>
      {<TagFilterConfiguration tagFilters={[]} onChange={noop()} timeConfig={{}} />}
    </StackItem>
  );
};
const MetricsForm = ({ form, onChange }) => {
  const metricConfiguration = form.get('metricConfiguration');
  const localOnChange = (path, fn) => {
    onChange(['metricConfiguration', ...path], fn);
  };
  if (!metricConfiguration) return false;

  return (
    <StackItem>
      <Header>Metric & Threshold</Header>
      <FormGroup>
        <Label>Metric</Label>
        <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="metricName" />
        {
          // TODO check, isn't there a way to get the available list
        }
        <FormGroup>
          <Label>Aggregation</Label>
          <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="metricAggregation" />

          {false && (
            <DropDownMock
              options={
                ruleAggregationOptions // TODO have to check why UPPER/LOWER conflict exists: input= p90 / id would be P90
              }
              onChange={noop}
            />
          )}
        </FormGroup>
        <Label>Threshold</Label>
        <InputMock form={metricConfiguration} onChange={onChange} fieldName={'threshold'} />
      </FormGroup>
    </StackItem>
  );
};

const DropDownMock = ({ options, ...props }) => (
  <Select {...props}>
    {(options ?? []).map(({ value, label }) => {
      const text = value && value !== '' ? `${label}(${value})` : label;
      return (
        <option id={value} key={value} value={value}>
          {text}
        </option>
      );
    })}
  </Select>
);

const InputMock = ({ form, onChange, fieldName, ...props }) => {
  return (
    <Input
      {...props}
      value={form?.get(fieldName)?.value}
      onChange={({ target }) => onChange([fieldName], f => f.setValue(target.value).setTouched(true))}
    />
  );
};

const all_services_mock = 'btg-B701Rx6o9QNXUS4TVw';

export function createMetricsForm(metricConfiguration) {
  return createMapForm()
    .put(
      'metricName',
      createField({
        value: metricConfiguration.metricName ?? 'unknoWNmatrix'
      })
    )
    .put(
      'metricAggregation',
      createField({
        value: metricConfiguration.metricAggregation ?? 'P97'
      })
    )
    .put(
      'threshold',
      createField({
        value: metricConfiguration.threshold ?? 111
      })
    );
}

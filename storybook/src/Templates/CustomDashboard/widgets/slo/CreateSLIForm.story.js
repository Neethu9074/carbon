import React, { useState } from 'react';

import InboundOrAllCallsOption from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import locals from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsSwitch.mless';
import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import { getApplicationConfigsAsResultObservable, getSliConfigurations } from './apiMock';
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

export default {
  title: 'Templates|CustomDashboard/widgets/slo/createSLI',
  component: CreateNewSLIForm
};

function CreateNewSLIForm({ form, applicationName, onChange, onChangeType }) {
  const sliEntityForm = form.get('sliEntity');
  const boundaryScope = sliEntityForm?.get('boundaryScope')?.value;
  const updateBoundaryScope = value => {
    onChange(['sliEntity', 'boundaryScope'], f => f.setValue(value).setTouched(true));
  };
  const sliType = sliEntityForm.get('sliType').value;

  return (
    <Stack space="large">
      <StackItem>
        <Header>SLI Customization</Header>
        <FormGroup>
          <Label>Name</Label>
          <InputMock form={form} onChange={onChange} fieldName="sliName" />
          <Label>Type</Label>
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
      </StackItem>
      <StackItem>
        <Header>SLI Entity</Header>
        <FormGroup>
          <Label>Application Perspective</Label>
          <Input disabled value={applicationName} />
          <Label>Boundary</Label>
          <StackItem>
            <div className={locals.inboundOutboundCallsSwitchContainer}>
              <Row>
                <Col m={6}>
                  <InboundOrAllCallsOption
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.inbound)}
                    scope={boundaryScopes.inbound}
                  />
                </Col>
                <Col m={6}>
                  <InboundOrAllCallsOption
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.all)}
                    scope={boundaryScopes.all}
                  />
                </Col>
              </Row>
            </div>
          </StackItem>
          <Label>Service</Label>
          <DropDownMock options={[{ value: '', label: 'Please select' }]} value={null} />
          <Label>Endpoints</Label>
          <DropDownMock options={[{ value: '', label: 'Please select' }]} />
        </FormGroup>
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
  if (metricConfiguration == null) return false;
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
    {(options ?? []).map(({ value, label }) => (
      <option id={value} key={value} value={value}>
        {label} ({value})
      </option>
    ))}
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

export function Default() {
  const api = {
    getSliConfigurations,
    getApplicationConfigsAsResultObservable
  };

  const savedState = {
    id: 'joschi-test-1',
    sliName: 'SLI on all services latency p90 <10ms',
    metricConfiguration: {
      metricName: 'latency',
      metricAggregation: 'P90',
      threshold: 10
    },
    sliEntity: {
      sliType: 'application',
      applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
      serviceId: null,
      endpointId: null,
      boundaryScope: 'ALL'
    }
  };
  const sliEntity = savedState?.sliEntity ?? {};

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

  let form = createMapForm();
  form = form.put(
    'sliName',
    createField({
      value: savedState['sliName'] ?? demo['sliName'] ?? all_services_mock
    })
  ); // TODO map with saved-state / sliEntity

  form = form.put('sliEntity', sliEntityForm);

  if (savedState.metricConfiguration) {
    form = form.put('metricConfiguration', createMetricsForm(savedState.metricConfiguration));
  }

  const [uiForm, setForm] = useState(form);
  const onChange = (path, fn) => {
    setForm(uiForm.updateIn(path, fn));
  };

  const onChangeType = value => {
    let updatedForm = uiForm.updateIn(['sliEntity', 'sliType'], f => f.setValue(value).setTouched(true));
    if (value === 'application') {
      setForm(updatedForm.put('metricConfiguration', createMetricsForm(savedState.metricConfiguration)));
    } else {
      setForm(updatedForm.remove('metricConfiguration'));
    }
  };

  return (
    <CreateNewSLIForm
      form={uiForm}
      updateForm={setForm}
      applicationName={'robotshop'}
      onChange={onChange}
      api={api}
      onChangeType={onChangeType}
    />
  );
}

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

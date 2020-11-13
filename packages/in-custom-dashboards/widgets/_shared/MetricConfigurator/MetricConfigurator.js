import React from 'react';

import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyArray } from 'in-services/fixedObjects';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function MetricConfigurator({
  form,
  onChange,
  onChangeSource,
  withLabelConfiguration,
  customLabelFormGroup,
  formatterFormGroup,
  widgetPreview,
  timeShiftConfiguration,
  disabledDataSources = emptyArray,
  axisForm,
  axisName
}) {
  const sourceField = form.get('source');

  const dataSourceFormGroupElement = (
    <FormGroup>
      <Label htmlFor="metic-configurator-source" hasError={!sourceField.valid && sourceField.touched}>
        Data Source
      </Label>
      <Select
        id="metic-configurator-source"
        value={sourceField.value}
        onChange={e => onChangeSource(e.target.value)}
        hasError={!sourceField.valid && sourceField.touched}
      >
        <option value="">Please select</option>
        {Object.values(sources)
          .filter(
            ({ source, visible }) =>
              (visible && disabledDataSources.indexOf(source) === -1) || sourceField.value === source
          )
          .sort((a, b) => compareIgnoreCase(a.label, b.label))
          .map(({ source, label, disabled }) => (
            <option key={source} value={source} disabled={disabled}>
              {label}
            </option>
          ))}
      </Select>
      <TouchedMessages field={sourceField} />
    </FormGroup>
  );

  let labelFormGroupElement = customLabelFormGroup;
  if (withLabelConfiguration) {
    labelFormGroupElement = form.get('label').map(field => (
      <FormGroup>
        <Label htmlFor="metic-configurator-label" hasError={!field.valid && field.touched}>
          Label
        </Label>
        <Input
          id="metic-configurator-label"
          type="text"
          value={field.value}
          onChange={e => onChange(['label'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!field.valid && field.touched}
        />
        <TouchedMessages field={field} />
      </FormGroup>
    ));
  }

  if (sourceField.value) {
    const FormComponent = sources[sourceField.value].Form;
    return (
      <FormComponent
        form={form}
        onChange={onChange}
        dataSourceFormGroup={dataSourceFormGroupElement}
        labelFormGroup={labelFormGroupElement}
        formatterFormGroup={formatterFormGroup}
        widgetPreview={widgetPreview}
        timeShiftConfiguration={timeShiftConfiguration}
        axisForm={axisForm}
        axisName={axisName}
      />
    );
  }

  return (
    <>
      <Row>
        <Col lg={6}>{labelFormGroupElement}</Col>
      </Row>
      <Row withoutTopMargin>
        <Col lg={6}>{dataSourceFormGroupElement}</Col>
      </Row>
    </>
  );
}

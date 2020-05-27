import React from 'react';

import { ServiceLevelIndicators } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/form';
import locals from 'in-custom-dashboards/widgets/BigNumber/sliConfiguration.mless';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getSLIConfigurations } from 'in-custom-dashboards/api';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Select from 'in-components/form/Select';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';

export default connectTo(() => {
  return {
    SLIConfigurations: getSLIConfigurations().map(
      ({ data }) => (data ? data.map(({ id, sliName }) => ({ id, sliName })) : null)
    )
  };
})(FormComponent);

function FormComponent({
  form,
  onChange,
  dataSourceFormGroup,
  labelFormGroup,
  formatterFormGroup,
  widgetPreview,
  SLIConfigurations,
  timeShiftConfiguration
}) {
  const SLIConfigIdField = form.get('SLIConfigId');
  const SLOField = form.get('SLO');
  const metricField = form.get('metric');

  return (
    <>
      {labelFormGroup && (
        <Row>
          <Col lg={6}>{labelFormGroup}</Col>
        </Row>
      )}

      <Row withoutTopMargin>
        <Col lg={6}>{dataSourceFormGroup}</Col>

        <Col lg>
          <FormGroup>
            <Label htmlFor="metric-configurator-SLIId">Configured SLO</Label>
            <Select
              id="metric-configurator-SLIId"
              value={SLIConfigIdField.value}
              onChange={e =>
                onChange([], form =>
                  form.updateIn(['SLIConfigId'], field => field.setValue(e.target.value).setTouched(true))
                )
              }
              hasError={!SLIConfigIdField.valid && SLIConfigIdField.touched}
            >
              <option value="">Please select an SLI configuration</option>
              {SLIConfigurations &&
                SLIConfigurations.map(({ id, sliName }) => (
                  <option key={id} value={id}>
                    {sliName}
                  </option>
                ))}
            </Select>
            <TouchedMessages field={SLIConfigIdField} />
            <HelpText className={locals.subTextFormField}>
              The configurations against which SLIs are calculated
            </HelpText>
          </FormGroup>
        </Col>
      </Row>
      <Header>Customize the widget</Header>

      <Row>
        <Col lg>
          <FormGroup>
            <Label htmlFor="metric-configurator-SLO">SLO value</Label>
            <Input
              id="metric-configurator-SLI"
              type="number"
              value={SLOField.value}
              onChange={e => onChange(['SLO'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!SLOField.valid && SLOField.touched}
            />
            <TouchedMessages field={SLOField} />
            <HelpText className={locals.subTextFormField}>
              Type in your desired SLO value from 0 to 1. E.g, 0.9 for 90% SLO.
            </HelpText>
          </FormGroup>
        </Col>

        <Col lg>
          <FormGroup>
            <Label htmlFor="metric-configurator-SLI">Specifics</Label>
            <Select
              id="metric-configurator-SLI"
              value={metricField.value}
              onChange={e =>
                onChange([], form =>
                  form.updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                )
              }
              hasError={!metricField.valid && metricField.touched}
            >
              <option value="">Please select an SLI</option>
              {Object.keys(ServiceLevelIndicators)
                .sort((a, b) => compareIgnoreCase(ServiceLevelIndicators[a], ServiceLevelIndicators[b]))
                .map(key => (
                  <option key={key} value={key}>
                    {ServiceLevelIndicators[key]}
                  </option>
                ))}
            </Select>
            <TouchedMessages field={metricField} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col lg>
          {formatterFormGroup}
          {timeShiftConfiguration}
        </Col>
        {widgetPreview && <Col lg>{widgetPreview}</Col>}
      </Row>
    </>
  );
}

import React from 'react';

import * as serviceLevelIndicators from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/serviceLevelIndicators';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Select from 'in-components/form/Select';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  sliConfigurations: getSliConfigurations().map(({ data }) => data)
})(FormComponent);

function FormComponent({
  form,
  onChange,
  dataSourceFormGroup,
  labelFormGroup,
  formatterFormGroup,
  widgetPreview,
  sliConfigurations,
  timeShiftConfiguration
}) {
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
          {form.get('SLIConfigId').map(field => (
            <FormGroup>
              <Label htmlFor="metric-configurator-sli-id">Configured SLO</Label>
              <Select
                id="metric-configurator-sli-id"
                value={field.value}
                onChange={e =>
                  onChange([], form =>
                    form.updateIn(['SLIConfigId'], field => field.setValue(e.target.value).setTouched(true))
                  )
                }
                hasError={!field.valid && field.touched}
              >
                <option value="">Please select</option>
                {sliConfigurations &&
                  sliConfigurations.map(({ id, sliName }) => (
                    <option key={id} value={id}>
                      {sliName}
                    </option>
                  ))}
              </Select>
              <TouchedMessages field={field} />
              <HelpText>The configurations against which SLIs are calculated</HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <Header>Customize the widget</Header>

      <Row>
        <Col lg>
          {form.get('SLO').map(field => (
            <FormGroup>
              <Label htmlFor="metric-configurator-slo">Service-Level Objective</Label>
              <Input
                id="metric-configurator-slo"
                type="number"
                value={field.value}
                onChange={e => onChange(['SLO'], field => field.setValue(Number(e.target.value)).setTouched(true))}
                hasError={!field.valid && field.touched}
                min={0}
                max={1}
                step={0.1}
              />
              <TouchedMessages field={field} />
              <HelpText>
                Type in your desired SLO value between 0 and 1, e.g. <code>0.9</code> for 90% SLO.
              </HelpText>
            </FormGroup>
          ))}
        </Col>

        <Col lg>
          {form.get('metric').map(field => (
            <FormGroup>
              <Label htmlFor="metric-configurator-metric">Metric</Label>
              <Select
                id="metric-configurator-metric"
                value={field.value}
                onChange={e =>
                  onChange([], form =>
                    form.updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                  )
                }
                hasError={!field.valid && field.touched}
              >
                <option value="">Please select</option>
                {Object.keys(serviceLevelIndicators)
                  .sort((a, b) => compareIgnoreCase(serviceLevelIndicators[a], serviceLevelIndicators[b]))
                  .map(key => (
                    <option key={key} value={key}>
                      {serviceLevelIndicators[key]}
                    </option>
                  ))}
              </Select>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
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

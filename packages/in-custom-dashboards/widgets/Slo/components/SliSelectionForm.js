import React from 'react';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { sliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import { Row, Col } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import connectTo from 'in-hoc/connectTo';

import locals from './SliSelectionForm.mless';

export default connectTo(() => ({
  sliConfigurations: getSliConfigurations().map(({ data }) => data)
}))(SliSelectionForm);

function SliSelectionForm({ form, onChange, sliConfigurations, applicationId, openManageSLIComponent }) {
  const filteredSLIs = sliConfigurations?.filter(sli => sli?.sliEntity?.applicationId === applicationId) ?? [];
  const sliConfigField = form.get(sliConfigId);
  return (
    <>
      <Row withoutTopMargin withBottomMargin={false}>
        <Col md={2}>
          <KeyValue value="SLI" label="Service Level Indicator" inverted />
        </Col>
        <Col md={10} className={locals.rightAligned}>
          {sliConfigField.map(field => (
            <FormGroup withoutBottomMargin className={locals.form}>
              <Select
                disabled={!applicationId}
                value={field?.value}
                onChange={e =>
                  onChange([], form =>
                    form.updateIn([sliConfigId], field => field.setValue(e.target.value).setTouched(true))
                  )
                }
                hasError={!field.valid && field.touched}
              >
                {filteredSLIs.length === 0 && <option value="">None available, please create one.</option>}
                {filteredSLIs.length !== 0 && <option value="">Please select</option>}
                {filteredSLIs.map(({ id, sliName }) => (
                  <option key={id} value={id}>
                    {sliName}
                  </option>
                ))}
              </Select>
            </FormGroup>
          ))}
          <div className={locals.gap} />
          {openManageSLIComponent}
        </Col>
        <Col mdOffset={2} md={10}>
          <OverridingTextTouchedMessage field={sliConfigField} message="Please select a SLI." />
        </Col>
      </Row>
    </>
  );
}

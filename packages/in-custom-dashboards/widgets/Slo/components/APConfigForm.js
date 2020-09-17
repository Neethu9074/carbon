import React from 'react';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Select from 'in-components/form/Select';

export default function APConfigForm({ apConfigIdField, apConfigs, onUpdateApConfigId }) {
  return (
    <div>
      <Row withoutTopMargin>
        <Col md={2}>
          <KeyValue label="User Journey / Offering" value="Application Perspective" inverted />
        </Col>
        <Col xs>
          {apConfigIdField.map(field => (
            <FormGroup withoutBottomMargin>
              <Select
                id="sli-config-ap"
                value={field?.value}
                onChange={e => {
                  const apId = e.target.value;
                  onUpdateApConfigId(apId);
                }}
                hasError={!field.valid && field.touched}
              >
                {(apConfigs?.length ?? 0) === 0 && <option value="">No Application Perspectives!</option>}
                {apConfigs?.length > 0 && <option value="">Please select</option>}
                {[...(apConfigs ?? [])] // need to clone: readonly array may not be sorted
                  .sort((a, b) => compareIgnoreCase(a.label, b.label))
                  .map(({ label, id }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
              </Select>
              <OverridingTextTouchedMessage field={field} message="Please select an Application Perspective." />
              <HelpText>
                Set up user journeys / offerings by modeling them as an Application Perspective in the Applications area
                of the product.
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
    </div>
  );
}

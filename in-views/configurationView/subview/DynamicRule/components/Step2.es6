import React from 'react';

import RuleControl from 'in-views/configurationView/subview/DynamicRule/components/RuleControl';
import Step from 'in-views/configurationView/subview/DynamicRule/components/Step';
import { evaluateClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Slider from 'in-components/Slider';

import './Step2.less';

const block = 'in-dynamic-rule-dialog-step-2';

export default function Step2({ form, onChange }) {
  return (
    <Step number={2} title="Event contitions" form={form} onChange={onChange}>
      <RuleControl
        name="Dynamic corridor"
        helpText="Instanas dynamic corridor can distinguish between normal and unregular metric trends, by analyzing a metric’s historical behavior."
      >
        {form.get('violationDirection').map(field => (
          <FormGroup>
            <Label htmlFor="rule-rule-violationDirection">Trigger if metric violates</Label>

            <Row>
              <Col cols={6}>
                <CorridorSelection
                  title="Upper corridor limit"
                  isActive={field.value === 'upper'}
                  onClick={() => onChange('violationDirection', 'upper')}
                />
              </Col>
              <Col cols={6}>
                <CorridorSelection
                  title="Lower corridor limit"
                  isActive={field.value === 'lower'}
                  onClick={() => onChange('violationDirection', 'lower')}
                />
              </Col>
            </Row>
            <Row>
              <Col cols={6}>
                <CorridorSelection
                  title="Either corridor limits"
                  isActive={field.value === 'either'}
                  onClick={() => onChange('violationDirection', 'either')}
                />
              </Col>
            </Row>
          </FormGroup>
        ))}
      </RuleControl>
      <RuleControl name="Sensitivity (Preview)" helpComponent={CorridorHelpBox}>
        <CorridorPreviewChart />
        {form.get('sensitivity').map(field => (
          <FormGroup>
            <Label htmlFor="rule-rule-sensitivity">Adjust Sensitivity</Label>
            <SensitivitySlider field={field} onChange={onChange} />
          </FormGroup>
        ))}
      </RuleControl>
    </Step>
  );
}

function CorridorHelpBox() {
  return (
    <div className={`${block}__corridor-help-box`}>
      <span>The system takes some time to be trained on a metric’s historical behavior.</span>
      <br />
      <br />
      <span>To adjust the sensitivity based on real data please check back after the training has been completed.</span>
    </div>
  );
}

function CorridorSelection({ isActive, title, onClick }) {
  return (
    <div
      className={evaluateClassNames({
        [`${block}__violation-direction`]: true,
        [`${block}__violation-direction__active`]: isActive
      })}
      onClick={onClick}
    >
      {title}
    </div>
  );
}

function CorridorPreviewChart() {
  return <div className={`${block}__corridor-preview-chart`} />;
}

function SensitivitySlider({ field, onChange }) {
  return (
    <div>
      <Slider
        className={`${block}__slider`}
        onChange={e => onChange('sensitivity', e.target.value)}
        min={0}
        max={100}
        step={1}
        value={field.value}
      />
      <div className={`${block}__slider-labels`}>
        <span>fewer events</span>
        <span>more events</span>
      </div>
    </div>
  );
}

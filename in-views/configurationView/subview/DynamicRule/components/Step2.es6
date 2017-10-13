import React from 'react';

import SensitivityPreview from 'in-views/configurationView/subview/DynamicRule/components/SensitivityPreview';
import RuleControl from 'in-views/configurationView/subview/DynamicRule/components/RuleControl';
import Step from 'in-views/configurationView/subview/DynamicRule/components/Step';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Slider from 'in-components/Slider';

import './Step2.less';

const block = 'in-dynamic-rule-dialog-step-2';

export default function Step2({ form, onChange }) {
  return (
    <Step number={2} title="Event contitions" form={form} onChange={onChange}>
      {instanaInternalFeaturesEnabled ? (
        <RuleControl
          name="Dynamic corridor"
          helpText="Instanas dynamic corridor can distinguish between normal and unregular metric trends, by analyzing a metric’s historical behavior."
        >
          {form.get('violationDirection').map(field => (
            <FormGroup>
              <Label htmlFor="rule-rule-violationDirection">Trigger if metric violates</Label>

              <div className={`${block}__button-wrapper`}>
                <CorridorSelection
                  title="Upper corridor limit"
                  isActive={field.value === 'upper'}
                  onClick={() => onChange('violationDirection', 'upper')}
                />
                <CorridorSelection
                  title="Either corridor limits"
                  isActive={field.value === 'either'}
                  onClick={() => onChange('violationDirection', 'either')}
                />
                <CorridorSelection
                  title="Lower corridor limit"
                  isActive={field.value === 'lower'}
                  onClick={() => onChange('violationDirection', 'lower')}
                />
              </div>
            </FormGroup>
          ))}
        </RuleControl>
      ) : null}
      <RuleControl name="Sensitivity (Preview)" helpComponent={CorridorHelpBox}>
        {form.get('sensitivity').map(field => (
          <FormGroup>
            <Label htmlFor="rule-rule-sensitivity">Adjust Sensitivity</Label>
            <SensitivitySlider field={field} onChange={onChange} />
          </FormGroup>
        ))}
        <SensitivityPreview form={form} />
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

function SensitivitySlider({ field, onChange }) {
  return (
    <div>
      <Slider
        className={`${block}__slider`}
        onChange={e => onChange('sensitivity', 100 - e.target.value)}
        min={0}
        max={100}
        step={1}
        value={100 - field.value}
      />
      <div className={`${block}__slider-labels`}>
        <span>fewer events</span>
        <span>more events</span>
      </div>
    </div>
  );
}

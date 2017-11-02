import React from 'react';

import SensitivityPreview from 'in-views/configurationView/subview/DynamicRule/components/SensitivityPreview';
import RuleControl from 'in-views/configurationView/subview/DynamicRule/components/RuleControl';
import Spacer from 'in-views/configurationView/subview/DynamicRule/components/Spacer';
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
    <Step number={2} title="Event Conditions" form={form} onChange={onChange}>
      {instanaInternalFeaturesEnabled ? (
        <RuleControl
          name="Dynamic corridor"
          helpText="The dynamic corridor is used to distinguish between normal and unregular metric trends-, by analyzing historical behavior."
        >
          {form.get('violationDirection').map(field => (
            <FormGroup>
              <Label htmlFor="rule-rule-violationDirection">Trigger if metric surpasses</Label>

              <div className={`${block}__button-wrapper`}>
                <CorridorSelection
                  title="Upper limit"
                  isActive={field.value === 'upper'}
                  onClick={() => onChange('violationDirection', 'upper')}
                />
                <CorridorSelection
                  title="Either limit"
                  isActive={field.value === 'either'}
                  onClick={() => onChange('violationDirection', 'either')}
                />
                <CorridorSelection
                  title="Lower limit"
                  isActive={field.value === 'lower'}
                  onClick={() => onChange('violationDirection', 'lower')}
                />
              </div>
            </FormGroup>
          ))}
        </RuleControl>
      ) : null}

      <Spacer />

      <RuleControl name="Sensitivity (Preview)" helpComponent={CorridorHelpBox}>
        {form.get('sensitivity').map(field => (
          <FormGroup>
            <Label htmlFor="rule-rule-sensitivity">Corridor Sensitivity</Label>
            <SensitivitySlider field={field} onChange={onChange} />
          </FormGroup>
        ))}
        <SensitivityPreview form={form} />
        <Legend />
      </RuleControl>
    </Step>
  );
}

function CorridorHelpBox() {
  return (
    <div className={`${block}__corridor-help-box`}>
      <span>The system takes time to train on historical behavior.</span>
      <br />
      <br />
      <span>
        To adjust the sensitivity based on real data please check back after creating the rule (may take up to 30m).
      </span>
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

function Legend() {
  return (
    <div className={`${block}__legend`}>
      <div className={`${block}__legend-block`}>
        <div style={{ background: '#ff4229' }} className={`${block}__legend-rect`} />irregular metric trend
      </div>
      <div className={`${block}__legend-block`}>
        <div style={{ background: '#e5e5e5' }} className={`${block}__legend-rect`} />dynamic corridor
      </div>
      <div className={`${block}__legend-block`}>
        <div style={{ background: '#5da6da' }} className={`${block}__legend-rect`} />sample metric
      </div>
    </div>
  );
}

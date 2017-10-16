import React from 'react';

import Toggle from 'in-components/form/Toggle';
import Button from 'in-components/Button';

import './Step4.less';

const block = 'in-dynamic-rule-dialog-step-4';

export default function Step4({ form, onChange }) {
  return form.get('enabled').map(field => (
    <div className={block}>
      <div className={`${block}__left`}>
        <div className={`${block}__toggle-wrapper`}>
          <Toggle
            className={`${block}__toggle`}
            checked={field.value}
            onChange={e => onChange('enabled', e.target.checked)}
          />
          Set rule active ?
        </div>
        <span className={`${block}__help-text`}>
          Activating this rule will immediately trigger corresponding events once the training is complete. We recommend
          waiting for training to complete in order to consider the behavior and adjust the sensitivity if necessary
          before activating.
        </span>
      </div>
      <div className={`${block}__right`}>
        <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
        </Button>
      </div>
    </div>
  ));
}

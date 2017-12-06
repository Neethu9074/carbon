import React from 'react';

import Button from 'in-components/Button';

import './Step4.less';

const block = 'in-dynamic-rule-dialog-step-4';

export default function Step4({ form }) {
  return (
    <div className={block}>
      <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
        Save
      </Button>
    </div>
  );
}

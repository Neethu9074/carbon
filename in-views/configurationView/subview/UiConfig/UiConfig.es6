import React from 'react';

import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';

import './UiConfig.less';

const block = 'in-ui-config';

export default function UiConfig() {
  return (
    <div className={block}>
      <SubViewHeader>
        User Interface Settings
      </SubViewHeader>
    </div>
  );
}

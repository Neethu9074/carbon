/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import OperatorSelectorOverlay from 'in-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import { getAllowedOperators } from 'in-components/QueryBuilder/tagFilter/typeToOperatorsMapping';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import { STRING } from 'in-components/QueryBuilder/tagFilter/types';

export default {
  component: OperatorSelectorOverlay
};

export const Default = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <OperatorSelectorOverlay
        value={CONTAINS}
        allowedOperators={getAllowedOperators({
          type: 'STRING'
        })}
        tagType={STRING}
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'default'
};

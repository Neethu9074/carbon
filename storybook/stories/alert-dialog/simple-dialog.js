import { storiesOf } from '@storybook/react';
import React from 'react';

import SimpleAlertDialogPresenter from 'in-settings/alert-dialog/simple/SimpleAlertDialogPresenter';

storiesOf('alert-dialog/simple-dialog', module).add('Simple Dialog', () => <SimpleDialog />);

function SimpleDialog() {
  return <SimpleAlertDialogPresenter />;
}

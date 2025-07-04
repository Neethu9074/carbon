/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import CreateNewLocationDialog from 'in-synthetics/createLocation/CreateNewLocationDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

const NewLocationButton = () => {
  const handleClick = () => {
    addActiveDialog(<CreateNewLocationDialog onClose={close} />);
  };
  return (
    <Button onClick={handleClick} kind="primary" icon="lib_synthetic_location" size="compact">
      {t('in-synthetics:dialog.createLocation.newLocation')}
    </Button>
  );
};

export default NewLocationButton;

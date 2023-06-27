/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import CreateSloDialog from 'in-service-levels/components/ConfigDialog/CreateSloDialog';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export default function FloatingAddSloButton() {
  const openCreateSloDialog = () => addActiveDialog(<CreateSloDialog />);

  return (
    <FloatingActionButtons>
      <FloatingActionButton icon="lib_openclose_add" onClick={openCreateSloDialog}>
        {t('in-service-levels:general.addButtonLabel')}
      </FloatingActionButton>
    </FloatingActionButtons>
  );
}

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
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';

export default function FloatingAddSloButton() {
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };
  const openCreateSloDialog = () => addActiveDialog(<CreateSloDialog mode="NEW" trackingMeta={meta} />);

  return (
    <FloatingActionButtons>
      <FloatingActionButton icon="lib_openclose_add" onClick={openCreateSloDialog}>
        {t('in-service-levels:general.addButtonLabel')}
      </FloatingActionButton>
    </FloatingActionButtons>
  );
}

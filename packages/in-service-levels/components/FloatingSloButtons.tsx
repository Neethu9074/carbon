/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import CreateSloDialog from 'in-service-levels/components/ConfigDialog/CreateSloDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

export default function FloatingSloButtons() {
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };
  const openCreateSloDialog = () => addActiveDialog(<CreateSloDialog mode="NEW" trackingMeta={meta} />);
  const openCreateSmartAlertDialog = () => addActiveDialog(<CreateSmartAlertDialog />);

  return (
    <FloatingActionButtons>
      <FloatingActionButtonMenu>
        <Button icon="lib_openclose_add" kind="primaryv2" onClick={openCreateSloDialog}>
          {t('in-service-levels:general.addButtonLabel', { context: 'slo' })}
        </Button>
        <Button icon="lib_alerts_create" kind="primaryv2" onClick={openCreateSmartAlertDialog}>
          {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
        </Button>
      </FloatingActionButtonMenu>
    </FloatingActionButtons>
  );
}

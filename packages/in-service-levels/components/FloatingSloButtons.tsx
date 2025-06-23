/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Add, Notification } from '@carbon/icons-react';
import React from 'react';

import { Button } from '@instana/carbon';

// eslint-disable-next-line no-restricted-imports
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/slo/CreateSmartAlertDialog';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

export default function FloatingSloButtons() {
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };
  const openCreateSloDialog = () => addActiveDialog(<ConfigureSloDialog mode="NEW" trackingMeta={meta} />);
  const openCreateSmartAlertDialog = () => addActiveDialog(<CreateSmartAlertDialog />);

  return (
    <FloatingActionButtons>
      <FloatingActionButtonMenu>
        <Button renderIcon={Add} size={'md'} kind="secondary" onClick={openCreateSloDialog}>
          {t('in-service-levels:general.addButtonLabel', { context: 'slo' })}
        </Button>
        <Button renderIcon={Notification} size={'md'} kind="secondary" onClick={openCreateSmartAlertDialog}>
          {t('in-service-levels:general.addButtonLabel', { context: 'smartAlert' })}
        </Button>
      </FloatingActionButtonMenu>
    </FloatingActionButtons>
  );
}

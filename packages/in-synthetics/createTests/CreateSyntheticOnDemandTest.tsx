/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import CreateSyntheticOnDemandTestDialog from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialog';
import { CreateSyntheticOnDemandProps } from 'in-synthetics/utils/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

interface CreateSyntheticOnDemandTestProps extends CreateSyntheticOnDemandProps {
  isLocationsLoading?: boolean;
}
const CreateSyntheticOnDemandTest = ({
  testId,
  testLocations,
  onlineLocations,
  isLocationsLoading = false
}: CreateSyntheticOnDemandTestProps) => {
  const handleClick = () => {
    addActiveDialog(
      <CreateSyntheticOnDemandTestDialog
        testId={testId}
        testLocations={testLocations}
        onlineLocations={onlineLocations}
      />
    );
  };

  return (
    <Button
      onClick={handleClick}
      icon="ib_synthetic_run_now"
      kind="secondary"
      disabled={isLocationsLoading || onlineLocations?.length === 0}
    >
      {t('in-synthetics:dialog.createOnDemandTest.buttonLabel')}
    </Button>
  );
};

export default CreateSyntheticOnDemandTest;

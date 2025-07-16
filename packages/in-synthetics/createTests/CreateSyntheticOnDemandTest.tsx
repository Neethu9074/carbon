/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import CreateSyntheticOnDemandTestDialog from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

interface Props {
  testId: string;
  testLocations: string[];
  testType: string;
}
const CreateSyntheticOnDemandTest = ({ testId, testLocations, testType }: Props) => {
  const handleClick = () => {
    addActiveDialog(
      <CreateSyntheticOnDemandTestDialog testId={testId} testLocations={testLocations} testType={testType} />
    );
  };

  return (
    <Button onClick={handleClick} icon="ib_synthetic_run_now" kind="secondary">
      {t('in-synthetics:dialog.createOnDemandTest.buttonLabel')}
    </Button>
  );
};

export default CreateSyntheticOnDemandTest;

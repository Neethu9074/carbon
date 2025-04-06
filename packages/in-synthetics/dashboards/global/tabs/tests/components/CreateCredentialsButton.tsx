/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { getAllSyntheticCredentialsForEntitySelectionWithDefaults } from 'in-synthetics/subscriptions/getAllSyntheticTestsForEntitySelection';
import CreateCredentialDialog from 'in-synthetics/createCredentials/CreateCredentialDialog';
import { syntheticOpenCredentialDialogButtonClick } from 'in-synthetics/tracking/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const CreateCredentialsButton = () => {
  const { trackCta } = useSegmentTracking();
  const timeConfig = useTimeConfig();
  const credentialNames: string[] = [];
  const credentialList = useObservable(
    () => getAllSyntheticCredentialsForEntitySelectionWithDefaults({ timeConfig }),
    []
  );
  credentialList?.data?.map(credential => credentialNames.push(credential.name));
  const handleClick = () => {
    syntheticOpenCredentialDialogButtonClick(trackCta);
    addActiveDialog(<CreateCredentialDialog credentialNames={credentialNames} onClose={close} />);
  };

  return (
    <Button size="compact" kind="action" onClick={handleClick} icon="lib_synthetic_credential">
      {t('in-synthetics:dialog.createCredential.createButton')}
    </Button>
  );
};

export default CreateCredentialsButton;

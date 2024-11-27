/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import CreateCredentialDialog from 'in-synthetics/createCredentials/CreateCredentialDialog';
import { syntheticOpenCredentialDialogButtonClick } from 'in-synthetics/tracking/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

const CreateCredentialsButton = ({ credentialNames }: { credentialNames: string[] }) => {
  const { trackCta } = useSegmentTracking();
  const handleClick = () => {
    syntheticOpenCredentialDialogButtonClick(trackCta);
    addActiveDialog(<CreateCredentialDialog credentialNames={credentialNames} onClose={close} />);
  };

  return (
    <Button
      size={carbonButtonEnabled ? 'compact' : 'normal'}
      kind="action"
      onClick={handleClick}
      icon="lib_synthetic_credential"
    >
      {t('in-synthetics:dialog.createCredential.createButton')}
    </Button>
  );
};

export default CreateCredentialsButton;

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import CreateSyntheticTestDialog from 'in-synthetics/createTests/dialog/CreateSyntheticTestDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { syntheticCreateButtonClick } from 'in-synthetics/tracking/tracker';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

interface CreateSyntheticTestProps {
  onClose: () => void;
}

const CreateSyntheticTest = ({ onClose }: CreateSyntheticTestProps) => {
  const { trackCta } = useSegmentTracking();
  const handleClick = () => {
    // Segment Tracker
    syntheticCreateButtonClick(trackCta);
    addActiveDialog(<CreateSyntheticTestDialog onClose={onClose} />);
  };

  return (
    <Button onClick={handleClick} icon="lib_openclose_add_box" kind="primaryv2">
      {t('in-synthetics:dialog.createTest.buttonLabel')}
    </Button>
  );
};

export default CreateSyntheticTest;

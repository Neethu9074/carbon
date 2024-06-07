/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, Card, Typography } from '@instana/components';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { deleteBusinessPerspective } from 'in-bizops/api/perspectives';
import { businessPerspectivesPath } from 'in-bizops/navigation/paths';
import { t } from 'in-i18n';

import local from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/perspectiveConfiguration.mless';

interface RemoveProps {
  perspectiveId: string;
  goToPath: (path: string) => void;
}

export function Remove({ perspectiveId, goToPath }: RemoveProps) {
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleRemoveClick = () => {
    deleteBusinessPerspective(perspectiveId).once(onSuccess, onError);
  };

  const onSuccess = () => {
    goToPath(businessPerspectivesPath);
  };

  //TODO! Implement error handling
  const onError = () => {};

  return (
    <Card
      size="s"
      useMaxAvailableHeight={false}
      title={t('in-bizops:dashboards.perspectives.configuration.removeCardLabel')}
    >
      <div className={local.cardContents}>
        <Typography variant="body-small">
          {t('in-bizops:dashboards.perspectives.configuration.removePerspectiveDisclaimer')}
        </Typography>
        <CheckboxFancy
          label={t('in-bizops:dashboards.perspectives.configuration.removePerspectiveCheckbox')}
          checked={checkboxChecked}
          onChange={e => {
            setCheckboxChecked(e.target.checked);
          }}
        />
        <div className={local.rightJustify}>
          <Button
            className={local.button}
            size="compact"
            kind="danger"
            onClick={handleRemoveClick}
            disabled={!checkboxChecked}
          >
            {t('in-bizops:dashboards.perspectives.configuration.removePerspectiveButton')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, Card, Checkbox } from '@instana/components';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { deleteBusinessPerspective } from 'in-bizops/api/perspectives';
import { businessPerspectivesPath } from 'in-bizops/navigation/paths';
import { TIMEOUT_IN_MS } from 'in-bizops/utils/constants';
import { t } from 'in-i18n';

import local from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/perspectiveConfiguration.mless';

interface RemoveProps {
  perspectiveId: string;
  perspectiveName: string;
  goToPath: (path: string) => void;
}

export function Remove({ perspectiveId, perspectiveName, goToPath }: RemoveProps) {
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleRemoveClick = () => {
    deleteBusinessPerspective(perspectiveId).once(
      () => {
        goToPath(businessPerspectivesPath);
        addMessage({
          type: 'info',
          title: t('in-bizops:dashboards.perspectives.configuration.businessPerspectiveDeleted'),
          content: t('in-bizops:dashboards.perspectives.configuration.businessPerspectiveDeletedDetails', {
            perspectiveName: perspectiveName
          }),
          timeout: TIMEOUT_IN_MS
        });
      },
      error => {
        addMessage({
          type: 'danger',
          title: t('in-bizops:dashboards.perspectives.configuration.error'),
          content: error.message,
          timeout: TIMEOUT_IN_MS
        });
      }
    );
  };

  return (
    <Card
      size="s"
      useMaxAvailableHeight={false}
      title={t('in-bizops:dashboards.perspectives.configuration.removeCardLabel')}
    >
      <div className={local.cardContents}>
        <h3 className={local.removeDisclaimer}>
          {t('in-bizops:dashboards.perspectives.configuration.removePerspectiveDisclaimer')}
        </h3>
        <Checkbox
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

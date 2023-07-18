/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button, Spacer } from '@instana/components';
import { t } from '@instana/i18n-react';

import ConfigureAssociatedActionsDialog from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { EventSpecification } from 'in-automation/api';
import { Action } from 'in-types';

interface RightHeaderProps {
  eventSpecification: EventSpecification;
  actions: Action[];
  isCustomEvent: boolean;
  triggerReload: () => void;
}

export default function AssociatedActionsRightHeader({
  eventSpecification,
  actions,
  isCustomEvent,
  triggerReload
}: RightHeaderProps) {
  const onClick = () =>
    addActiveDialog(
      <ConfigureAssociatedActionsDialog
        eventSpecification={eventSpecification}
        actions={actions}
        isCustomEvent={isCustomEvent}
        onClose={close}
        triggerReload={triggerReload}
      />
    );

  return (
    <>
      <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={onClick}>
        {t('in-automation:selectActions')}
      </Button>
      <Spacer horizontal="xsmall" />
    </>
  );
}

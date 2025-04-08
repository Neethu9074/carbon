/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Edit, TrashCan } from '@carbon/icons-react';
import React, { PropsWithChildren } from 'react';

import { ProductiveCard } from '@instana/ibm-products';

import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Trans, t } from 'in-i18n';

import locals from './NameDescriptionCard.mless';

interface NameDescriptionCardProps {
  isEditMode: boolean;
  isValid: boolean;
  title: string;
  teamName: string;
  editHandler: () => void;
  deleteHandler: () => void;
  saveHandler: () => void;
  cancelHandler: () => void;
}

const NameDescriptionCard = ({
  isEditMode,
  isValid,
  title,
  teamName,
  editHandler,
  deleteHandler,
  saveHandler,
  cancelHandler,
  children
}: PropsWithChildren<NameDescriptionCardProps>) => {
  const actions = [
    {
      icon: TrashCan,
      iconDescription: t('in-settings:tabs.teams.delete'),
      id: 'settings-teams-details-delete-team',
      onClick: () => {
        addActiveDialog(
          <ConfirmationDialog
            header={t('in-settings:components.confirmRemove')}
            description={
              <Trans
                i18nKey="in-settings:components.confirmRemoveItem"
                values={{ itemName: t('in-settings:tabs.teams.teamWithName', { name: teamName }) }}
              />
            }
            onSubmit={deleteHandler}
            confirmButtonLabel={t('in-settings:tabs.remove')}
            confirmButtonKind="danger"
            confirmButtonAutoFocus
          />
        );
      }
    },
    {
      icon: Edit,
      iconDescription: t('in-settings:tabs.teams.edit'),
      id: 'settings-teams-details-edit-team',
      onClick: editHandler
    }
  ];

  if (isEditMode) {
    return (
      <ProductiveCard
        actionIcons={actions}
        className={locals.nameAndDescriptionCard}
        onPrimaryButtonClick={saveHandler}
        onSecondaryButtonClick={cancelHandler}
        primaryButtonDisabled={!isValid}
        primaryButtonPlacement="bottom"
        primaryButtonText={t('in-settings:tabs.save')}
        secondaryButtonPlacement="bottom"
        secondaryButtonText={t('in-settings:tabs.cancel')}
        title={title}
      >
        {children}
      </ProductiveCard>
    );
  } else {
    return (
      <ProductiveCard className={locals.nameAndDescriptionCard} title={title} actionIcons={actions}>
        {children}
      </ProductiveCard>
    );
  }
};

export default NameDescriptionCard;

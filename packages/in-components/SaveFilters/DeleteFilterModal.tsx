/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonComposedModal as ComposedModal,
  CarbonModalFooter as ModalFooter,
  CarbonModalHeader as ModalHeader,
  CarbonModalBody as ModalBody,
  CarbonStack as Stack,
  Typography,
  CarbonButton as Button
} from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import { deleteFilter } from 'in-applications/api/filters';
import { t, Trans } from 'in-i18n';

interface Props {
  filterId: string;
  filterName: string;
}
export const DeleteFilterModal = ({ filterId, filterName }: Props): JSX.Element => {
  const handleDelete = () => {
    if (!filterId) return;
    deleteFilter(filterId).subscribe(() => {
      close();
    });
  };

  const modalBody = (
    <Stack gap={6}>
      <Typography variant="body-01">
        <Trans
          i18nKey="in-applications:analyze.deleteConfirmation"
          values={{ filterName: filterName }}
          components={{
            i: <i style={{ fontStyle: 'italic' }} />
          }}
        />
      </Typography>

      <Typography variant="body-01">{t('in-applications:analyze.actionCannotBeUndone')}</Typography>
    </Stack>
  );
  return (
    <ComposedModal aria-label="Confirm filter deletion" size="md" open onClose={close}>
      <ModalHeader title={<div>{t('in-applications:analyze.deleteFilterModalLabel')}</div>} />
      <ModalBody>{modalBody}</ModalBody>
      <ModalFooter>
        <Button kind="ghost" onClick={close}>
          {t('in-applications:buttonCancel')}
        </Button>
        <Button kind="danger" dangerDescription={t('in-applications:buttonDelete')} onClick={handleDelete}>
          {t('in-applications:buttonDelete')}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};

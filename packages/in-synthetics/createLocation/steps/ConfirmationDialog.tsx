/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactElement } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { ButtonKinds, Table, Tbody, Td, Th, Thead, Tr } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { SyntheticDatacenter } from '@instana/types';
import { t } from '@instana/i18n-react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import SaveButton from 'in-components/form/SaveButton';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface Props {
  header: string | ReactElement;
  headerIcon?: string;
  buttonLabel?: string;
  buttonKind?: keyof typeof ButtonKinds;
  onSubmit: () => void;
  isSaving?: boolean;
  onClose?: () => void;
  form: MapForm<any>;
}

const ConfirmationDialog = ({
  header,
  headerIcon,
  buttonLabel = t('in-synthetics:dialog.createLocation.done'),
  buttonKind,
  onSubmit,
  isSaving,
  onClose,
  form
}: Props) => {
  const button = (
    <SaveButton isSaving={isSaving} kind={buttonKind}>
      {buttonLabel}
    </SaveButton>
  );

  return (
    <BaseDialog title={header} headerIcon={headerIcon} onClose={onClose} onSubmit={onSubmit} customButtons={button}>
      <div>
        <div className={locals.descriptionHeadline}>
          {t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.headline')}
        </div>
        <DangerousHtmlPresenter
          className={locals.htmlText}
          html={t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.message')}
        />
      </div>
      <Table className={locals.fullWidth}>
        <Thead>
          <Tr size="compact">
            <Th>
              {t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.datacenterCode')}
            </Th>
            <Th>
              {t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.datacenterName')}
            </Th>
            <Th>
              {t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.datacenterStatus')}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {form.get('syntheticDatacenters').value.map((datacenter: SyntheticDatacenter) => {
            const { code, label } = datacenter;
            return (
              <Tr key={generateUniqueShortId()} size="compact">
                <Td>{code}</Td>
                <Td>{label}</Td>
                <Td>
                  {
                    <div className={locals.entityWrapper}>
                      <HealthDot className={classNames({ [locals.dot]: true })} severity={5} iconSize={8} />
                      <span>{t('in-synthetics:dialog.createLocation.status.pending')}</span>
                    </div>
                  }
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </BaseDialog>
  );
};

export default ConfirmationDialog;

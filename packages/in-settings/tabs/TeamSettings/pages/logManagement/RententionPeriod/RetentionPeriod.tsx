/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';

import { Button, Input, Typography } from '@instana/components';

import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import Select from 'in-components/form/Select/Select';
import Label from 'in-components/form/Label/Label';
import Dialog from 'in-components/Dialog/Dialog';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './RetentionPeriod.mless';

const localisationStrings = {
  retentionPeriod: t('in-settings:tabs.retentionPeriod.retentionPeriod'),
  retentionDialogDescription: t('in-settings:tabs.retentionPeriod.retentionDialogDescription'),
  changeRetentionPeriod: t('in-settings:tabs.retentionPeriod.changeRetentionPeriod'),
  logRetentionPeriod: t('in-settings:tabs.retentionPeriod.logRetentionPeriod'),
  changeReason: t('in-settings:tabs.retentionPeriod.changeReason'),
  days: t('in-settings:tabs.retentionPeriod.days'),
  cancel: t('in-settings:tabs.cancel'),
  typeToConfirm: t('in-settings:tabs.retentionPeriod.typeToConfirm'),
  changeError: t('in-settings:tabs.retentionPeriod.changeError'),
  changeSuccess: t('in-settings:tabs.retentionPeriod.changeSuccess')
};

export default function RententionPeriod() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <>
      <SettingsDetailPage>
        <Title title={localisationStrings.retentionPeriod} />
        <section className={locals.titleSection}>
          <SubViewHeaderComponent>{localisationStrings.retentionPeriod}</SubViewHeaderComponent>
          <Button onClick={() => setShowConfirmation(true)} kind="danger">
            Change retention period
          </Button>
        </section>
        {/* <main>

      </main> */}
      </SettingsDetailPage>
      {showConfirmation && (
        <RetentionPeriodDialog
          setShowConfirmation={setShowConfirmation}
          setIsDeleting={setIsDeleting}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

interface RetentionPeriodDialogProps {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
}

function RetentionPeriodDialog({ setShowConfirmation, setIsDeleting, isDeleting }: RetentionPeriodDialogProps) {
  // const [daysDropdownValue, setDaysDropdownValue] = useState('0')
  const daysDropdownValues = [7, 20, 30, 60, 90];

  const ConfirmationButtons = (
    <>
      <Button kind="secondary" onClick={() => closeConfirmationDialog()}>
        {localisationStrings.cancel}
      </Button>
      <Button disabled kind="danger">
        {localisationStrings.changeRetentionPeriod}
      </Button>
    </>
  );

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setIsDeleting(false);
  };

  return (
    <Dialog title="Change log retention period" onClose={closeConfirmationDialog}>
      <section className={locals.confirmationDialogContent}>
        <Typography variant="body-regular">{localisationStrings.retentionDialogDescription}</Typography>
        <Label htmlFor="LogRetentionPeriod">
          {localisationStrings.logRetentionPeriod}
          <Select>
            {daysDropdownValues.map(val => (
              <option value={val}>{`${val} days`}</option>
            ))}
          </Select>
        </Label>
        <Label htmlFor="reason">
          {localisationStrings.changeReason}
          <Input disabled={isDeleting} name="reason" />
        </Label>
        <Label htmlFor="typingValidation">
          {localisationStrings.typeToConfirm}
          <Input disabled={isDeleting} name="typingValidation" />
        </Label>
      </section>
      <section className={locals.buttons}>{ConfirmationButtons}</section>
    </Dialog>
  );
}

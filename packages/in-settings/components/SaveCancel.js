/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { savingMessage as entityFormSavingMessage } from 'in-hoc/entityForm';
import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-new-components/Button';

import locals from './SaveCancel.mless';

export default function SaveCancel({
  form,
  message,
  loading,
  saveEnabled = true,
  isCreate,
  listPath,
  cancelButtonLabel = 'Cancel',
  onClickCancelButton,
  hasSaveButton = true,
  hasCancelButton = true
}) {
  const saving = loading && message === entityFormSavingMessage;
  const saveButtonLabel = isCreate ? 'Create' : 'Save';
  const savingStateName = 'Saving…';

  return (
    <Fragment>
      <Section className={locals.line}>
        <SectionLine withMarginBottom={false} />
      </Section>
      <Section className={locals.saveCancelRow}>
        {hasCancelButton && (
          <Button kind="subtle" className={locals.button} onClick={onClickCancelButton || (() => goToPath(listPath))}>
            {cancelButtonLabel}
          </Button>
        )}
        {hasSaveButton && (
          <Button
            kind="create"
            type="submit"
            className={locals.button}
            disabled={(!form.hierarchyValid && form.touched) || loading || saving || !saveEnabled}
            icon={saving ? 'lib_actions_loading' : null}
            iconSpinning
          >
            {saving ? savingStateName : saveButtonLabel}
          </Button>
        )}
      </Section>
    </Fragment>
  );
}

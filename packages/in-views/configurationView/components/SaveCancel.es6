import React, { Fragment } from 'react';

import { savingMessage as entityFormSavingMessage } from 'in-hoc/entityForm';
import SectionLine from 'in-views/configurationView/components/SectionLine';
import Section from 'in-views/configurationView/components/Section';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-new-components/Button';

import locals from './SaveCancel.mless';

export default function SaveCancel({
  form,
  message,
  loading,
  isCreate,
  listPath,
  cancelButtonLabel = 'Cancel',
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
          <Button kind="subtle" className={locals.button} onClick={() => goToPath(listPath)}>
            {cancelButtonLabel}
          </Button>
        )}
        {hasSaveButton && (
          <Button
            kind="create"
            type="submit"
            className={locals.button}
            disabled={(!form.hierarchyValid && form.touched) || loading || saving}
            icon={saving ? 'spinner' : null}
            iconSpinning
          >
            {saving ? savingStateName : saveButtonLabel}
          </Button>
        )}
      </Section>
    </Fragment>
  );
}

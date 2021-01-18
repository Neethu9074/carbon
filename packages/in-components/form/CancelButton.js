import React from 'react';

import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function CancelButton({
  children = t('forms.actions.cancel'),
  kind = 'subtle',
  onClick,
  isSaving,
  autoFocus
}) {
  const disabled = isSaving;
  return (
    <Button kind={kind} onClick={disabled ? undefined : onClick} disabled={disabled} autoFocus={autoFocus}>
      {children}
    </Button>
  );
}

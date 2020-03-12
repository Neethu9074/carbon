import React from 'react';

import Button from 'in-new-components/Button';

export default function SaveButton({ form, isLoading, isSaving, children = 'Save', kind = 'create' }) {
  return (
    <Button
      kind={kind}
      type="submit"
      disabled={(form && !form.hierarchyValid && form.touched) || isLoading || isSaving}
      icon={isSaving ? 'lib_actions_loading' : null}
      iconSpinning
    >
      {children}
    </Button>
  );
}

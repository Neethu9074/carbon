import React from 'react';

import Button from 'in-new-components/Button';

export default function SaveButton({
  form,
  isLoading,
  isSaving,
  children = 'Save',
  kind = 'create',
  icon,
  type = 'submit',
  onClick
}) {
  return (
    <Button
      kind={kind}
      type={type}
      onClick={onClick}
      disabled={(form && !form.hierarchyValid && form.touched) || isLoading || isSaving}
      icon={isSaving ? 'lib_actions_loading' : icon}
      iconSpinning={isSaving}
    >
      {children}
    </Button>
  );
}

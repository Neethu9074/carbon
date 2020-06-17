import PropTypes from 'prop-types';
import React from 'react';

import Button from 'in-new-components/Button';

export default function SaveButton({
  form,
  isLoading,
  isSaving,
  children = 'Save',
  className,
  kind = 'create',
  icon,
  type = 'submit',
  onClick,
  disabled
}) {
  return (
    <Button
      kind={kind}
      type={type}
      onClick={onClick}
      disabled={(form && !form.hierarchyValid && form.touched) || isLoading || isSaving || disabled}
      icon={isSaving ? 'lib_actions_loading' : icon}
      iconSpinning={isSaving}
      className={className}
    >
      {children}
    </Button>
  );
}

SaveButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  form: PropTypes.object,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
  isSaving: PropTypes.bool,
  disabled: PropTypes.bool,
  kind: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
};

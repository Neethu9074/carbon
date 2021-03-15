/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function SaveButton({
  form,
  formId,
  isLoading,
  isSaving,
  children = t('forms.actions.save'),
  className,
  kind = 'create',
  icon,
  type = 'submit',
  onClick,
  disabled
}) {
  return (
    <Button
      formId={formId}
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
  // Will be turned into form= attribute on the buttons. Can be used
  // to implement form controls outside of the <form /> HTML sub-tree.
  formId: PropTypes.string,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
  isSaving: PropTypes.bool,
  disabled: PropTypes.bool,
  kind: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
};

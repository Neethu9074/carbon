/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

export default function DeleteButton({
  form,
  isDeleting,
  disabled,
  children = t('forms.actions.cancel'),
  className,
  kind = 'danger',
  icon,
  onClick
}) {
  return (
    <Button
      kind={kind}
      onClick={onClick}
      disabled={(form && !form.hierarchyValid && form.touched) || isDeleting || disabled}
      icon={isDeleting ? 'lib_actions_loading' : icon}
      iconSpinning={isDeleting}
      className={className}
    >
      {children}
    </Button>
  );
}

DeleteButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  form: PropTypes.object,
  icon: PropTypes.string,
  isDeleting: PropTypes.bool,
  disabled: PropTypes.bool,
  kind: PropTypes.string,
  onClick: PropTypes.func
};

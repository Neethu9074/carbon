/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm, MapFormItems } from 'formalistic';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, ButtonProps } from '@instana/components';

import { t } from 'in-i18n';

export interface DeleteButtonProps<FORM_TYPE extends MapFormItems> extends Partial<ButtonProps> {
  form: MapForm<FORM_TYPE>;
  icon: string;
  isDeleting: boolean;
  onClick: () => void;
}

export default function DeleteButton<FORM_TYPE extends MapFormItems>({
  form,
  isDeleting,
  disabled,
  children = t('forms.actions.cancel'),
  className,
  kind = 'danger',
  icon,
  onClick
}: DeleteButtonProps<FORM_TYPE>) {
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

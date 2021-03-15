/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import CancelButtonComponent from 'in-components/form/CancelButton';
import DeleteButtonComponent from 'in-components/form/DeleteButton';
import SaveButtonComponent from 'in-components/form/SaveButton';
import { t } from 'in-i18n';

import locals from './FormFooter.mless';

export default function FormFooter({ className, withRoundedBottomBorder, children }) {
  return (
    <nav
      className={classNames(locals.controls, className, { [locals.withRoundedBottomBorder]: withRoundedBottomBorder })}
    >
      {children}
    </nav>
  );
}

export function SaveButton(props) {
  return (
    <SaveButtonComponent className={locals.button} kind="create" {...props}>
      {props.children || t('forms.actions.save')}
    </SaveButtonComponent>
  );
}

export function CancelButton(props) {
  return (
    <CancelButtonComponent className={locals.button} {...props}>
      {props.children || t('forms.actions.cancel')}
    </CancelButtonComponent>
  );
}

export function DeleteButton(props) {
  return (
    <DeleteButtonComponent className={locals.button} {...props}>
      {props.label || t('forms.actions.delete')}
    </DeleteButtonComponent>
  );
}

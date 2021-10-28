/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import CancelButtonComponent, { CancelButtonProps } from 'in-components/form/CancelButton';
import DeleteButtonComponent, { DeleteButtonProps } from 'in-components/form/DeleteButton';
import SaveButtonComponent, { SaveButtonProps } from 'in-components/form/SaveButton';
import { t } from 'in-i18n';

import locals from './FormFooter.mless';

export interface FormFooterProps {
  className?: string;
  withRoundedBottomBorder?: boolean;
  children: React.ReactNode;
}

export default forwardRef<HTMLElement, FormFooterProps>(function FormFooter(
  { className, withRoundedBottomBorder, children },
  ref
) {
  return (
    <nav
      ref={ref}
      className={classNames(locals.controls, className, { [locals.withRoundedBottomBorder]: withRoundedBottomBorder })}
    >
      {children}
    </nav>
  );
});

export function SaveButton(props: SaveButtonProps) {
  return (
    <SaveButtonComponent className={locals.button} kind="create" {...props}>
      {props.children || t('forms.actions.save')}
    </SaveButtonComponent>
  );
}

export function CancelButton(props: CancelButtonProps) {
  return (
    <CancelButtonComponent className={locals.button} {...props}>
      {props.children || t('forms.actions.cancel')}
    </CancelButtonComponent>
  );
}

interface ExtendedDeleteButtonProps extends DeleteButtonProps {
  label?: string;
}

export function DeleteButton(props: ExtendedDeleteButtonProps) {
  return (
    <DeleteButtonComponent className={locals.button} {...props}>
      {props.label || t('forms.actions.delete')}
    </DeleteButtonComponent>
  );
}

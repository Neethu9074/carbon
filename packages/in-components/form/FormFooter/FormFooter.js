import React from 'react';

import DeleteButtonComponent from 'in-components/form/DeleteButton';
import SaveButtonComponent from 'in-components/form/SaveButton';
import classNames from 'classnames';
import Button from 'in-new-components/Button/Button';

import locals from './FormFooter.mless';

export default function FormFooter({ className, children }) {
  return <nav className={classNames(locals.controls, className)}>{children}</nav>;
}

export function SaveButton(props) {
  return (
    <SaveButtonComponent className={locals.button} kind="primary" {...props}>
      {props.children || 'Save'}
    </SaveButtonComponent>
  );
}

export function CancelButton(props) {
  return (
    <Button className={locals.button} kind="secondary" {...props}>
      Cancel
    </Button>
  );
}

export function DeleteButton(props) {
  return (
    <DeleteButtonComponent className={locals.button} {...props}>
      {props.label || 'Delete'}
    </DeleteButtonComponent>
  );
}

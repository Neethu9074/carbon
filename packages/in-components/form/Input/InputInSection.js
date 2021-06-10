/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Section from 'in-components/workspace/Section';
import Input from 'in-components/form/Input/Input';

import locals from './InputInSection.mless';

export default forwardRef(InputInSection);

function InputInSection({ label, additionalContent, actions, ...inputProps }, ref) {
  const { id, hasError } = inputProps;

  if (actions) {
    actions = <div className={locals.actions}>{actions}</div>;
  }

  return (
    <Section titleHtmlFor={id} title={label} hasError={hasError} actions={actions}>
      <Input {...inputProps} className={classNames(inputProps.className, locals.input)} ref={ref} />
      {additionalContent}
    </Section>
  );
}

InputInSection.propTypes = {
  ...Input.propTypes,
  label: PropTypes.string.isRequired,
  additionalContent: PropTypes.node,
  actions: Section.propTypes.actions
};

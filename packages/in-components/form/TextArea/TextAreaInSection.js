/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import TextArea from 'in-components/form/TextArea/TextArea';
import Section from 'in-new-components/workspace/Section';

import locals from './TextAreaInSection.mless';

export default forwardRef(TextAreaInSection);

function TextAreaInSection({ label, additionalContent, actions, ...textAreaProps }, ref) {
  const { id, hasError } = textAreaProps;

  if (actions) {
    actions = <div className={locals.actions}>{actions}</div>;
  }

  return (
    <Section titleHtmlFor={id} title={label} hasError={hasError} actions={actions}>
      <TextArea {...textAreaProps} className={classNames(textAreaProps.className, locals.textArea)} ref={ref} />
      {additionalContent}
    </Section>
  );
}

TextAreaInSection.propTypes = {
  ...TextArea.propTypes,
  label: PropTypes.string.isRequired,
  additionalContent: PropTypes.node,
  actions: Section.propTypes.actions
};

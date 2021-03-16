/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Section from 'in-new-components/workspace/Section';
import Select from 'in-components/form/Select';

import locals from './SelectInSection.mless';

export default forwardRef(SelectInSection);

function SelectInSection({ label, additionalContent, actions, useAlternateBg, ...selectProps }, ref) {
  const { id, hasError } = selectProps;

  if (actions) {
    actions = <div className={locals.actions}>{actions}</div>;
  }

  return (
    <Section titleHtmlFor={id} title={label} useAlternateBg={useAlternateBg} hasError={hasError} actions={actions}>
      <Select {...selectProps} className={classNames(selectProps.className, locals.select)} ref={ref} />
      {additionalContent}
    </Section>
  );
}

SelectInSection.propTypes = {
  ...Select.propTypes,
  label: Section.propTypes.title,
  additionalContent: PropTypes.node,
  actions: Section.propTypes.actions,
  useAlternateBg: Section.propTypes.useAlternateBg
};

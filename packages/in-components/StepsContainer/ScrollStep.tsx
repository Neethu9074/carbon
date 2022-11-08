/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';

import locals from './ScrollStep.mless';

export type ScrollStepProps = { id?: string; children: ReactNode };
export default function ScrollStep({ id, children }: ScrollStepProps) {
  return (
    <section id={id} className={locals.container}>
      {children}
    </section>
  );
}

ScrollStep.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string
};

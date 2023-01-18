/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import locals from './DescriptionButtons.mless';

interface Props {
  children: ReactNode;
}

export default function DescriptionButtons({ children }: Props) {
  return <div className={locals.buttons}>{children}</div>;
}

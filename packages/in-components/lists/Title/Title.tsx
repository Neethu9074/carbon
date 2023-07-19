/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import locals from './Title.mless';

export type childrenProp = {
  children: ReactNode;
};
export default function Title({ children }: childrenProp) {
  return <h1 className={locals.title}>{children}</h1>;
}

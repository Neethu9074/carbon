/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { floatingActionButtons$ } from 'in-components/FloatingActionButton/stores/floatingActionButtons';

import locals from './Footer.mless';

export default function Footer() {
  const floatingActionButtons = useObservable(floatingActionButtons$, []) as unknown[];

  return floatingActionButtons?.length ? <footer className={locals.footer} /> : null;
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { floatingActionButtons$ } from 'in-components/FloatingActionButton/stores/floatingActionButtons';
import connectTo from 'in-hoc/connectTo';

import locals from './Footer.mless';

export default connectTo(() => ({
  hasFloatingFooter: floatingActionButtons$.map(buttons => buttons && buttons.length > 0)
}))(Footer);

function Footer({ hasFloatingFooter }) {
  return hasFloatingFooter ? <footer className={locals.footer} /> : null;
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Lettering from 'in-components/Lettering';
import AppIcon from 'in-themes/AppIcon';

import locals from './Stan.mless';

export default function Stan() {
  return (
    <div className={locals.wrapper}>
      <div className={locals.content}>
        <AppIcon />
        <Lettering />
      </div>
    </div>
  );
}

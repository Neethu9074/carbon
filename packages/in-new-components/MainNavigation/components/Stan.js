/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Lettering from 'in-components/Lettering';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Stan.mless';

export default function Stan() {
  return (
    <div className={locals.wrapper}>
      <div className={locals.content}>
        <SvgIcon className={locals.icon} type="lib_navigation_stan" size="l" />
        <Lettering />
      </div>
    </div>
  );
}

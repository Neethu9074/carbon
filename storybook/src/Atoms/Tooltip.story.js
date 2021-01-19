/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Tooltip from 'in-components/Tooltip';

export default {
  title: 'Atoms|Tooltip',
  component: Tooltip
};

export const Default = () => (
  <Tooltip content="This content shows up in open tooltip">
    <div>
      <h1>Default</h1>
      <h2>...</h2>
    </div>
  </Tooltip>
);

export const WithAlignment = () => (
  <Tooltip content="This content shows up in open tooltip" align="bottomMiddle">
    <div>
      <h1>With alignment:</h1>
      <h2>bottomMiddle</h2>
    </div>
  </Tooltip>
);

export const WithTheme = () => (
  <Tooltip content="This content shows up in open tooltip" themeStyle="light">
    <div>
      <h1>With themeStyle:</h1>
      <h2>light</h2>
    </div>
  </Tooltip>
);

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

export const dark = 'dark';
export const light = 'light';
export const lightV2 = 'lightV2';

export const ThemeContext = React.createContext(light);
ThemeContext.displayName = 'ThemeContext';

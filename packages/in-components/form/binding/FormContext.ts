/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item } from 'formalistic';
import React from 'react';

export const FormContext = React.createContext<Item | undefined>(undefined);

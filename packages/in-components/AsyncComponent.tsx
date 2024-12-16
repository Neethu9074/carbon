/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ComponentType } from 'react';

// @ts-expect-error needs migration
import { createAsyncComponent } from 'in-components/routing/createAsyncComponent';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';

interface AsyncComponentProps<T = any> {
  component: () => Promise<{ default: ComponentType<T> }>;
  props?: T;
}

const loadingIndicator = <LoadingIndicator size="regular" style={{ height: '100vh' }} />;

export default function AsyncComponent<T>({ component, props }: AsyncComponentProps<T>) {
  const Component = createAsyncComponent(loadingIndicator, component);

  return <Component {...props} />;
}

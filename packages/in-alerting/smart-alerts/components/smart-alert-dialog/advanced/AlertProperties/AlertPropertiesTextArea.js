/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';

import TextArea from 'in-components/form/TextArea/TextArea';

import locals from './AlertPropertiesTextArea.mless';

const AlertPropertiesTextarea = forwardRef(function AlertPropertiesTextarea(props, ref) {
  return <TextArea {...props} className={locals.textArea} ref={ref} />;
});

export default AlertPropertiesTextarea;

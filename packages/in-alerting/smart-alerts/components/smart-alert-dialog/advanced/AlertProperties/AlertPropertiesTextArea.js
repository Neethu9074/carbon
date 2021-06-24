/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import TextArea from 'in-components/form/TextArea/TextArea';

import locals from './AlertPropertiesTextArea.mless';

const AlertPropertiesTextarea = forwardRef(function AlertPropertiesTextarea({ formField, ...reaminingProps }, ref) {
  return (
    <FormGroup>
      <TextArea
        {...reaminingProps}
        hasError={hasFieldError(formField)}
        className={locals.textArea}
        value={formField?.value}
        ref={ref}
      />
      <TouchedMessages field={formField} />
    </FormGroup>
  );
});

AlertPropertiesTextarea.propTypes = {
  formField: PropTypes.shape({
    value: PropTypes.string
  })
};

function hasFieldError(field) {
  return field && !field?.valid && field?.touched;
}

export default AlertPropertiesTextarea;

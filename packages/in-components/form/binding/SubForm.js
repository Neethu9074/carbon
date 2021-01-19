/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { FormContext } from 'in-components/form/binding/FormContext';
import { pathPropType } from 'in-components/form/binding/paths';
import FormBound from 'in-components/form/binding/FormBound';

export default function SubForm({ path, autoHide, children }) {
  return (
    <FormBound path={path} autoHide={autoHide}>
      {({ form, setForm, absolutePath, disabled }) => (
        <FormContext.Provider
          value={{
            form,
            rootPath: absolutePath,
            setForm,
            disabled
          }}
        >
          {children}
        </FormContext.Provider>
      )}
    </FormBound>
  );
}

SubForm.propTypes = {
  path: pathPropType.isRequired,
  autoHide: PropTypes.bool,
  children: PropTypes.node.isRequired
};

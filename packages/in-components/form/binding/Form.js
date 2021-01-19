/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { FormContext } from 'in-components/form/binding/FormContext';

export default function Form({ onSubmit, children, form, setForm, disabled }) {
  return (
    <FormContext.Provider
      value={{
        form,
        rootPath: [],
        setForm,
        disabled
      }}
    >
      <form
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();

          if (!form.hierarchyValid) {
            setForm(form.setTouched(true, { recurse: true }));
            return;
          }

          onSubmit(form);
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

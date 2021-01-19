/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useRef, useLayoutEffect } from 'react';

export default function IndeterminateInput(allProps) {
  // Strip out the indeterminate prop because it has to be set via
  // JavaScript. It is unsupported as a regular HTML attribute. See
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
  const { indeterminate, ...props } = allProps;
  const { checked } = allProps;

  const ref = useRef();
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = Boolean(indeterminate && checked == null);
    }
  }, [indeterminate, ref.current, checked]);

  return (
    <input
      {...props}
      // Outside React state must be in sync with the component state.
      // An indeterminate state must mean checked==null. However React
      // requires the input to be either controlled or uncontrolled.
      // So we pass checked=false to the inp
      checked={checked ?? false}
      ref={ref}
      type="checkbox"
    />
  );
}

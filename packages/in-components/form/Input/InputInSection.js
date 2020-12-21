import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Section from 'in-new-components/workspace/Section';
import Input from 'in-components/form/Input/Input';

export const kinds = ['section', 'vertical', 'plain'];

export default forwardRef(InputInSection);

function InputInSection({ label, additionalContent, ...inputProps }, ref) {
  const { id } = inputProps;

  return (
    <Section title={<label htmlFor={id}>{label}</label>}>
      <Input {...inputProps} ref={ref} />
      {additionalContent}
    </Section>
  );
}

InputInSection.propTypes = {
  ...Input.propTypes,
  label: PropTypes.string.isRequired,
  additionalContent: PropTypes.node
};

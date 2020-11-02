import PropTypes from 'prop-types';
import React from 'react';

import Section from 'in-new-components/workspace/Section';
import Button from 'in-new-components/Button/Button';

import locals from './AlertFilterConfigurator.mless';

export default function AlertFilterConfigurator({ queryBuilderComponent, form, updateForm, ...remainingProps }) {
  const tagFilterExpression = form.get('tagFilterExpression')?.value;

  const handleChange = tfe => {
    updateForm(
      form
        .updateIn(['tagFilterExpression'], f => f.setValue(tfe).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  };

  return (
    <Section
      className={locals.queryBuilderSection}
      icon="lib_actions_filter"
      title="Filter"
      firstLineAlignmentOffsetPx={3}
      actions={
        tagFilterExpression.length > 0 && (
          <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={() => handleChange([])}>
            Clear
          </Button>
        )
      }
    >
      <>
        {queryBuilderComponent({
          ...remainingProps,
          onChange: tfe => handleChange(tfe),
          value: tagFilterExpression
        })}
      </>
    </Section>
  );
}

AlertFilterConfigurator.propTypes = {
  queryBuilderComponent: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  moveClearActionLeft: PropTypes.bool
};

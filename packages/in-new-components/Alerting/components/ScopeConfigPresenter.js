/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import Stack from 'in-new-components/layout/Stack/Stack';
import HelpText from 'in-components/form/HelpText';

import locals from './ScopeConfigPresenter.mless';

export default function ScopeConfigPresenter({
  convertedTagFilterExpression,
  tagFilterExpressionUiModel,
  queryBuilder,
  tagFilterList,
  iconLabelConfig
}) {
  return (
    <Stack space="xsmall">
      <WithQB1orQB2
        onUsesQB1={() => tagFilterList}
        onUsesQB2={() => (
          <>
            <HelpText className={locals.helpTextNoTopSpace}>Application Perspective</HelpText>
            <IconLabel {...iconLabelConfig} />
            {tagFilterExpressionUiModel.length > 0 && (
              <>
                <HelpText>Additional Filters</HelpText>
                {queryBuilder}
              </>
            )}
          </>
        )}
        shouldFallbackToQB2={isQB2Config => isQB2Config(convertedTagFilterExpression)}
      />
    </Stack>
  );
}

ScopeConfigPresenter.propTypes = {
  convertedTagFilterExpression: PropTypes.bool,
  iconLabelConfig: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string
  }),
  queryBuilder: PropTypes.element,
  tagFilterExpressionUiModel: PropTypes.array,
  tagFilterList: PropTypes.element
};

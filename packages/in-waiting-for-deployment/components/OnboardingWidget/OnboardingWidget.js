import { compose } from 'recompose';
import React from 'react';

import OnboardingWidgetPresenter from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidgetPresenter';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import withUrlState from 'in-hoc/withUrlState';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/',
        name: 'selectedEntry',
        parser: intParser,
        initialState: 0
      },
      {
        path: '/',
        name: 'selectedSubEntry',
        parser: intParser,
        initialState: 0
      }
    ],
    reducerName: 'onChange'
  })
)(OnboardingWidget);
function OnboardingWidget(props) {
  return (
    <OnboardingWidgetPresenter
      {...props}
      selectedSubEntryIndex={props.selectedSubEntry}
      selectedEntryIndex={props.selectedEntry}
      onEntrySelected={index => props.onChange({ selectedEntry: index })}
      onSubEntrySelected={index => props.onChange({ selectedSubEntry: index })}
    />
  );
}

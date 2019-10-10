import React from 'react';

import OnboardingWidget from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidget';

import locals from './FullViewOnboardingWidget.mless';

export default function FullViewOnboardingWidget(props) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.widgetWrapper}>
        <div className={locals.maxWidth}>
          <OnboardingWidget {...props} />
        </div>
      </div>
    </div>
  );
}

import React from 'react';

import ActiveSubView from 'in-views/configurationView/components/ActiveSubView';
import Navigation from 'in-views/configurationView/components/Navigation';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';

import './ConfigurationView.less';

const block = 'in-configuration-view';

export default function ConfigurationView({children}) {
  return (
    <FullscreenOverlayView className={block}>
      <Navigation />
      <ActiveSubView>
        {children}
      </ActiveSubView>
    </FullscreenOverlayView>
  );
}

import React from 'react';

import ActiveSubView from 'in-views/configurationView/components/ActiveSubView';
import DefaultConfigView from 'in-views/configurationView/subview/Default';
import Navigation from 'in-views/configurationView/components/Navigation';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';

import './ConfigurationView.less';

const block = 'in-configuration-view';

export default function ConfigurationView({ children }) {
  return (
    <FullscreenOverlayView className={block}>
      <Navigation />
      {children
        ? <ActiveSubView>
            {children}
          </ActiveSubView>
        : <DefaultConfigView />}
    </FullscreenOverlayView>
  );
}

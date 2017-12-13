import React from 'react';

import ActiveSubView from 'in-views/configurationView/components/ActiveSubView';
import DefaultConfigView from 'in-views/configurationView/subview/Default';
import Navigation from 'in-views/configurationView/components/Navigation';
import routes from 'in-client/js/routes/settingsRoutes';
import LegacyView from 'in-components/LegacyView';
import Title from 'in-components/Title';

import './ConfigurationView.less';

const block = 'in-configuration-view';

export default function ConfigurationView(props) {
  return (
    <div className={block}>
      <Title title="Settings" />
      <LegacyView />
      <Navigation />
      {!props.match.isExact ? <ActiveSubView>{routes}</ActiveSubView> : <DefaultConfigView />}
    </div>
  );
}

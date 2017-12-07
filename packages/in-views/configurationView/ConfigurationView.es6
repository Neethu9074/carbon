import React from 'react';

import ActiveSubView from 'in-views/configurationView/components/ActiveSubView';
import DefaultConfigView from 'in-views/configurationView/subview/Default';
import Navigation from 'in-views/configurationView/components/Navigation';
import FullBodyHeightWrapper from 'in-components/FullBodyHeightWrapper';
import routes from 'in-client/js/routes/settingsRoutes';
import Title from 'in-components/Title';

import './ConfigurationView.less';

const block = 'in-configuration-view';

export default function ConfigurationView(props) {
  return (
    <FullBodyHeightWrapper>
      <div className={block}>
        <Title title="Settings" />

        <Navigation />
        {!props.match.isExact ? <ActiveSubView>{routes}</ActiveSubView> : <DefaultConfigView />}
      </div>
    </FullBodyHeightWrapper>
  );
}

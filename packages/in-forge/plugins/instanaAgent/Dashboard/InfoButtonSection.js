import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import AgentConfiguration from 'in-forge/plugins/instanaAgent/Dashboard/AgentConfiguration';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import SensorsInfo from 'in-forge/plugins/instanaAgent/Dashboard/SensorsInfo';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import connectTo from 'in-hoc/connectTo';

import locals from './InfoButtonSection.mless';

export default connectTo({
  isInternalVisible: isInternalVisible$
})(function InfoButtonSection({ snapshot, isInternalVisible }) {
  return (
    <div className={locals.wrapper}>
      <ImageButton iconType="popup" onClick={() => setActiveDialog(<SensorsInfo snapshot={snapshot} />)}>
        Sensors Info
      </ImageButton>
      {isInternalVisible && (
        <ImageButton
          iconType="lib_kubernetes_spec"
          onClick={() => setActiveDialog(<AgentConfiguration snapshot={snapshot} />)}
          iconSize="l"
        >
          Agent Configuration
        </ImageButton>
      )}
    </div>
  );
});

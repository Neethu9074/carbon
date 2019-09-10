import React from 'react';

import AgentConfiguration from 'in-forge/plugins/instanaAgent/Dashboard/AgentConfiguration';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import SensorsInfo from 'in-forge/plugins/instanaAgent/Dashboard/SensorsInfo';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { isInstanaEngineer } from 'in-stores/user';

import locals from './InfoButtonSection.mless';

export default function InfoButtonSection({ snapshot }) {
  return (
    <div className={locals.wrapper}>
      <ImageButton iconType="popup" onClick={() => setActiveDialog(<SensorsInfo snapshot={snapshot} />)}>
        Sensors Info
      </ImageButton>
      {isInstanaEngineer && (
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
}

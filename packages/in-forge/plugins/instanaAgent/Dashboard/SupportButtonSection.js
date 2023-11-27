/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import { profileAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './InfoButtonSection.mless';

function ProfilerButton({ supportsAgentProfiling, snapshot }) {
  const profileButton = (
    <ImageButton
      iconType="lib_actions_settings"
      disabled={!supportsAgentProfiling}
      onClick={() => {
        profileAgent(snapshot);
      }}
    >
      {t('in-forge:plugins.instanaAgent.dashboard.profileAgent')}
    </ImageButton>
  );

  if (!supportsAgentProfiling) {
    return null;
  }
  return profileButton;
}

export default connectTo({
})(function InfoButtonSection({ snapshot }) {
  const supportsAgentProfiling = snapshot.getIn(['data', 'capabilities'])?.includes('agentprofiler');

  return (
    <div className={locals.wrapper}>
      <ProfilerButton supportsAgentProfiling={supportsAgentProfiling} snapshot={snapshot} />
    </div>
  );
});

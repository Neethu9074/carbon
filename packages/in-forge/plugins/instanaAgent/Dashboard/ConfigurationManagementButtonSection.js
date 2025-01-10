/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// import AgentConfiguration from 'in-forge/plugins/instanaAgent/Dashboard/AgentConfiguration';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import ConfigurationManagementDialog from 'in-forge/plugins/instanaAgent/Dashboard/ConfigurationManagementDialog';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import UpdateConfigurationDialog from 'in-forge/plugins/instanaAgent/Dashboard/UpdateConfigurationDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './InfoButtonSection.mless';

export default connectTo({
  isInternalVisible: isInternalVisible$
})(function ConfigurationManagementButtonSection({ snapshot }) {
  return (
    <div className={locals.wrapper}>
      {role.canConfigureAgents && snapshot.getIn(['data', 'git', 'present']) && (
        <ImageButton
          iconType="lib_actions_edit"
          onClick={() => addActiveDialog(<ConfigurationManagementDialog snapshot={snapshot} />)}
        >
          {snapshot.getIn(['data', 'git', 'initialized'])
            ? t('in-forge:plugins.instanaAgent.dashboard.buttonUpdate')
            : t('in-forge:plugins.instanaAgent.dashboard.buttonInitialize')}
        </ImageButton>
      )}
      <ImageButton
        iconType="lib_actions_copy"
        onClick={() => addActiveDialog(<UpdateConfigurationDialog snapshot={snapshot} />)}
      >
        {t('in-forge:plugins.instanaAgent.dashboard.updateConfig')}
      </ImageButton>
    </div>
  );
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import connectTo from 'in-hoc/connectTo';

import locals from './ConfigurationManagement.mless';

export default connectTo({}, function ConfigurationManagement({ snapshot }) {
  if (snapshot.getIn(['data', 'git', 'present'])) {
    if (snapshot.getIn(['data', 'git', 'initialized'])) {
      return (
        <DescriptionList className={locals.list}>
          <DescriptionItem title="Remote Name">{snapshot.getIn(['data', 'git', 'remoteName'])}</DescriptionItem>
          <DescriptionItem title="Remote Branch">{snapshot.getIn(['data', 'git', 'remoteBranch'])}</DescriptionItem>
          <DescriptionItem title="Remote URI">
            <a href={snapshot.getIn(['data', 'git', 'remoteUri'])}>{snapshot.getIn(['data', 'git', 'remoteUri'])}</a>
          </DescriptionItem>
          <DescriptionItem title="Commit Hash">
            <code>{snapshot.getIn(['data', 'git', 'commitHash'])}</code>
          </DescriptionItem>
          <DescriptionItem title="Commit Message">{snapshot.getIn(['data', 'git', 'commitMessage'])}</DescriptionItem>
          {snapshot.getIn(['data', 'git', 'error']) ? (
            <p className={locals.error}>
              Git-based configuration management could not be started! Please check the agent logs.
            </p>
          ) : null}
        </DescriptionList>
      );
    } else {
      return <p>This agent does not use git-based configuration management.</p>;
    }
  } else {
    return (
      <>
        <p>This agent is too outdated to support git-based configuration management.</p>
        <p>
          To use git-based configuration management please install an agent with at least bootstrap version{' '}
          <code>1.2.11</code>. You will need to install the agent anew, the git-based configuration management can not
          be updated dynamically.
        </p>
      </>
    );
  }
});

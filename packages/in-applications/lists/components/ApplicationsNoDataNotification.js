import React, { Fragment } from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import { applicationOpenSubmitFormTracker } from 'in-applications/tracker';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { newApplicationView } from 'in-applications/navigation/paths';
import ArticleContent from 'in-new-components/ArticleContent';
import { applicationPlugins } from 'in-forge/constants';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';

import locals from './ApplicationsNoDataNotification.mless';

export default function ApplicationsNoDataNotification() {
  return (
    <EntityPageMainNotification
      plugin={applicationPlugins.application}
      title="No Application Perspectives yet"
      renderExplanation={() => (
        <Fragment>
          <ArticleContent id="applicationsNoData" />
          {role.canConfigureApplications ? (
            <Button
              kind="create"
              href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
              onClick={() => applicationOpenSubmitFormTracker()}
            >
              Create Application Perspective
            </Button>
          ) : (
            <p className={locals.text}>They will appear here once an account administrator creates them.</p>
          )}
        </Fragment>
      )}
    />
  );
}

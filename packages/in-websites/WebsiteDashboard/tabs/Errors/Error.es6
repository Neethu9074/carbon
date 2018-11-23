import { just } from 'reactive-observables';
import React, { Fragment } from 'react';

import { getLinkToWebsite, errorsTabFullyQualified } from 'in-websites/navigation/paths';
import getWebsiteError from 'in-subscription/websiteMonitoring/getWebsiteError';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ location, timeConfig, websiteId, pageId }) => {
  const observables = {
    errorsListLink: getLinkToWebsite(websiteId, { tabPath: '/errors', pageId })
  };

  const errorId = getMatrixParameter(location, '/details', 'errorId');
  observables.errorId = just(errorId);
  if (errorId) {
    observables.result = getWebsiteError({
      timeConfig,
      errorId
    });
  }
  return observables;
})(ErrorTab);

function ErrorTab({ errorId }) {
  if (!errorId) {
    return <RedirectWithHash to={errorsTabFullyQualified} />;
  }

  // if (statementResult.progress.loading) {
  //   content = <DashboardSkeleton />;
  // } else if (statementResult.errors && statementResult.errors.length > 0) {
  //   content = <ErroneousResultPresenter errors={statementResult.errors} />;
  // } else {
  //   content = <Success statement={statementResult.data} {...props} />;
  // }

  return (
    <Fragment>
      <div>lol</div>
    </Fragment>
  );
}

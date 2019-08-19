import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationListFullyQualified } from 'in-cloudfoundry/navigation/paths';
import ViewSwitcher from 'in-cloudfoundry/lists/components/ViewSwitcher';
import ApplicationList from 'in-cloudfoundry/lists/ApplicationList';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function CloudfoundryMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Switch>
            <Route path={applicationListFullyQualified} render={() => <ApplicationList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
      <Footer />
    </Fragment>
  );
}

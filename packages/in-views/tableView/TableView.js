import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import ViewSwitcher from 'in-views/tableView/components/ViewSwitcher';
import Table from 'in-views/tableView/components/Table';
import LegacyView from 'in-components/LegacyView';
import SearchBar from 'in-components/SearchBar';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function TableView() {
  return (
    <Switch>
      {DashboardNavigationRoute}

      <Route
        path="/*"
        render={() => (
          <Sticky
            header={
              <Fragment>
                <SearchBar darkTheme />
                <ViewSwitcher darkTheme />
              </Fragment>
            }
          >
            <LegacyView />
            <Title title="Comparison Table" />
            <Table />
            <Footer />
          </Sticky>
        )}
      />
    </Switch>
  );
}

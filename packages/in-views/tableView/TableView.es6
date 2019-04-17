import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import ViewSwitcher from 'in-views/tableView/components/ViewSwitcher';
import Table from 'in-views/tableView/components/Table';
import LegacyView from 'in-components/LegacyView';
import SearchBar from 'in-components/SearchBar';
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
                <ViewSwitcher />
                <SearchBar />
              </Fragment>
            }
          >
            <LegacyView />
            <Title title="Comparison Table" />
            <Table />
          </Sticky>
        )}
      />
    </Switch>
  );
}

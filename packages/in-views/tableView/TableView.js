import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import ViewSwitcher from 'in-views/tableView/components/ViewSwitcher';
import Table from 'in-views/tableView/components/Table';
import LegacyView from 'in-components/LegacyView';
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
              <>
                <DashboardHeader theme={themes.dark} icon="lib_infrastructure" label="Infrastructure" />
                <DashboardHeaderModule theme={themes.dark} withBottomBorder>
                  <ViewSwitcher />
                </DashboardHeaderModule>
              </>
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

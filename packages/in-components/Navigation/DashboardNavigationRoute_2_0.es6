import { Route } from 'react-router-dom';
import React from 'react';

import Dashboard from 'in-components/Dashboard_2_0';

export default <Route path={'*/dashboard'} render={({ match }) => <Dashboard match={match} />} />;

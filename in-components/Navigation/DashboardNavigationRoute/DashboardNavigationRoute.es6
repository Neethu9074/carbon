import React from 'react';

import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import Dashboard from 'in-components/Dashboard';

export default <RouteWithTitle path={'*/dashboard'} component={Dashboard} windowTitle={'Dashboard'} />;

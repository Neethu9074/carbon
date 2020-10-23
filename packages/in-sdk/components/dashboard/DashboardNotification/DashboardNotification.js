import PropTypes from 'prop-types';
import React from 'react';

import { neutral, warning, error } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';

import locals from './DashboardNotification.mless';

export default function DashboardNotification({ children, type = 'neutral' }) {
  return (
    <div className={locals.container}>
      <Message type={mapTypes(type)} withIcon>
        {children}
      </Message>
    </div>
  );
}

DashboardNotification.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['neutral', 'info', 'warning', 'danger'])
};

function mapTypes(type) {
  if (type === 'warning') {
    return warning;
  }
  if (type === 'danger') {
    return error;
  }
  return neutral;
}

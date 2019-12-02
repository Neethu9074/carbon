import PropTypes from 'prop-types';
import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import Message from 'in-new-components/Message/Message';
import theme from 'in-themes';

import locals from './DashboardNotification.mless';

export default function DashboardNotification({ children, type = 'neutral' }) {
  return (
    <div className={locals.container}>
      <Message
        withIcon
        iconColor={theme.lib.colors.black72}
        type={type === 'danger' ? 'warning' : 'neutral'}
        className={evaluateClassNames({
          [locals[type]]: type
        })}
      >
        {children}
      </Message>
    </div>
  );
}

DashboardNotification.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['neutral', 'info', 'warning', 'danger'])
};

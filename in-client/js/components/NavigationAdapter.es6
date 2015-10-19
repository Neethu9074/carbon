import React from 'react';
import {Navigation, State} from 'react-router';

import {setUpdatedNavigationParameters} from 'in-services/navigation';

const NavigationAdapter = React.createClass({

  mixins: [Navigation, State],

  componentWillMount() {
    this.updateNavigationParameters();
  },

  componentWillUpdate() {
    this.updateNavigationParameters();
  },

  updateNavigationParameters() {
    setUpdatedNavigationParameters(
      this.getPathname(),
      this.getParams(),
      this.getQuery()
    );
  },

  render() {
    return null;
  }
});

export default NavigationAdapter;

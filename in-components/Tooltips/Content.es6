import rpt from 'prop-types';
import React from 'react';

import { getClassName } from 'in-services/util/react';

import './Content.less';

export default class extends React.PureComponent {
  static propTypes = {
    className: rpt.string,
    children: rpt.any.isRequired
  };

  render() {
    return (
      <div className={getClassName(this, 'in-tooltip__content')}>
        {this.props.children}
      </div>
    );
  }
}

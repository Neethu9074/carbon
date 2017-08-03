import React from 'react';

import { replaceBreadcrumbs } from 'in-stores/breadcrumb';

export default class BreadcrumbHelmet extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { context } = this.props;
    replaceBreadcrumbs(context);
  }

  render() {
    return null;
  }
}

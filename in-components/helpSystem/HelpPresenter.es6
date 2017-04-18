import rpt from 'prop-types';
import React from 'react';

import { helpId$ } from 'in-components/helpSystem/helpSystemStores';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    helpId: helpId$
  },
  class extends React.PureComponent {
    static displayName = 'HelpPresenter';

    static propTypes = {
      helpId: rpt.string
    };

    render() {
      if (this.props.helpId) {
        return <HelpDialog id={this.props.helpId} />;
      }

      return null;
    }
  }
);

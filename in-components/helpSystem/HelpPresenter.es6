import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import { helpId$ } from 'in-components/helpSystem/helpSystemStores';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    helpId: helpId$
  },
  React.createClass({
    displayName: 'HelpPresenter',

    mixins: [PureRenderMixin],

    propTypes: {
      helpId: React.PropTypes.string
    },

    render() {
      if (this.props.helpId) {
        return <HelpDialog id={this.props.helpId} />;
      }

      return null;
    }
  })
);

import React from 'react';

import {toggleLayouting, layoutingEnabled$} from 'in-map/src/stores/process/layouterStore';
import {view, types as views} from 'in-stores/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-components/LayoutControls/LayoutControls.less';


const block = 'in-layout-controls';
const rpt = React.PropTypes;

export default connectTo({
    layoutingEnabled: layoutingEnabled$,
    view
  }, React.createClass({

    displayName: 'layout controls',

    propTypes: {
      layoutingEnabled: rpt.bool,
      view: rpt.string
    },

    render() {
      const currentView = this.props.view;
      if (!currentView || currentView !== views.process) {
        return null;
      }

      return (
        <Button className={block}
                onClick={toggleLayouting}>

          {this.props.layoutingEnabled ? 'turn auto layouting off' : 'turn auto layouting on'}
        </Button>
      );
    }
  })
);

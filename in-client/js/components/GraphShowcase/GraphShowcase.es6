import React from 'react/addons';

import {goToMap} from 'in-stores/navigation';
import Button from 'in-components/Button';

import './GraphShowcase.less';

const block = 'in-graph-showcase';


const GraphShowcase = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    // TODO Define props
    // foo: rpt.string.isRequired
  },

  render() {
    return (
      <div className={block}>
        <Button className={block + '__back-to-map'}
                onClick={goToMap}>
          Back to Map
        </Button>
        Wow, such graph!
      </div>
    );
  }
});

export default GraphShowcase;

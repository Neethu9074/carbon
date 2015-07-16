'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';

const block = 'in-search';

// const tags = [
//   'ui-backend',
//   'ui-client',
//   'groundskeeper',
//   'issue-tracker',
//   'processor',
//   'accept',
//   'hadoop',
//   'kafka',
//   'redis',
//   'cassandra',
//   'nginx'
// ];

const Search = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  render() {
    return (
      <div className={block}>

      </div>
    );
  }
});

export default Search;

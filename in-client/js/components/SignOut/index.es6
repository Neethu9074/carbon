

import React from 'react/addons';
import {IntlMixin} from 'react-intl';

import Button from 'in-components/Button';

import './index.less';

const block = 'in-sign-out';

const Logout = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  render() {
    return (
      <form action='/auth/signOut'
            method='post'
            className={block}>
        <Button type='submit'
                className={block + '__button'}>
          {this.getIntlMessage('footer.signOut')}
        </Button>
      </form>
    );
  }
});

export default Logout;

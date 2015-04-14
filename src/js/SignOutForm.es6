'use strict';

import React from 'react';
import Button from './Button';

const SignOutForm = React.createClass({
  render() {
    // use window.instana.loadInfo.routes.signout
    const signOutRoute = 'about:blank';
    return (
      <form method='post'
            action={signOutRoute}>
        <Button type="submit">Sign out</Button>
      </form>
    );
  }
});

export default SignOutForm;

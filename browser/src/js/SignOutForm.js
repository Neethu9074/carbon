import React from 'react';
import Button from './Button';

const SignOutForm = React.createClass({
  render() {
    return (
      <form method='post'
            action={window.instana.loadInfo.routes.signout}>
        <Button type="submit">Sign out</Button>
      </form>
    );
  }
});

export default SignOutForm;

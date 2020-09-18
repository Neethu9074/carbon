import React from 'react';

import NewApplicationWaiter from 'in-applications/Forms/NewApplication/NewApplicationWaiter';

export default {
  title: 'Templates/application/NewApplicationWaiter',
  component: NewApplicationWaiter
};

export function Default() {
  return <NewApplicationWaiter match={{ params: { appId: '42' } }} result={{ progress: { loading: true } }} />;
}

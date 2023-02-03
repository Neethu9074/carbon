/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import MessageStack from 'in-components/MessageStack/MessageStack';

export default {
  component: MessageStack
};

export const Default = {
  args: {
    messages: [
      {
        message: 'Thundercats are on the move, Thundercats are loose.',
        level: 'warning'
      },
      {
        message: 'Feel the magic, hear the roar, Thundercats are loose.',
        level: 'warning'
      },
      {
        message: 'Thunder, thunder, thunder, Thundercats! Thunder, thunder, thunder, Thundercats!',
        level: 'error'
      }
    ]
  }
};

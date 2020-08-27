import { useContext } from 'react';

import { TimeConfigContext } from 'in-stores/time/TimeConfigContext';

export default function useFixedTimeConfig() {
  return useContext(TimeConfigContext).fixed;
}

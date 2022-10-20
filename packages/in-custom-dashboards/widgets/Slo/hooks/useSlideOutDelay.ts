/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect, useState } from 'react';

const slideTransitionDurationMillis = 500;

/*
 * This hook is used to render the create form only if it's opened and the
 * slide-transition was finished. It should prevent the SlideInView from render
 * a shadow if the content has been scrolled.
 */
export function useSlideOutDelay(
  visibility?: boolean,
  transitionDelay = slideTransitionDurationMillis
): [boolean, VoidFunction] {
  const [isVisible, setIsVisible] = useState(!!visibility);

  useEffect(() => {
    if (visibility) setIsVisible(true);
  }, [visibility]);

  function hide() {
    setTimeout(() => setIsVisible(false), transitionDelay);
  }

  return [isVisible, hide];
}

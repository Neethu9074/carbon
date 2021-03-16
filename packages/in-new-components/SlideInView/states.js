/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const slideInStates = {
  before: slideTransitionDurationMillis => ({
    showSlideInContent: true,
    staticContentStyle: {
      visibility: 'visible'
    },
    inputBlockerStyle: {
      visibility: 'visible',
      background: 'rgba(0 ,0, 0, 0)',
      transitionDuration: `${slideTransitionDurationMillis}ms`
    },
    headerStyle: {
      visibility: 'visible'
    },
    slideInContentStyle: {
      visibility: 'visible',
      transitionDuration: `${slideTransitionDurationMillis}ms`,
      transform: `translateX(0%)`
    }
  }),
  transition: slideTransitionDurationMillis => ({
    showSlideInContent: true,
    staticContentStyle: {
      visibility: 'visible'
    },
    inputBlockerStyle: {
      visibility: 'visible',
      background: 'rgba(0 ,0, 0, 0.25)',
      transitionDuration: `${slideTransitionDurationMillis}ms`
    },
    headerStyle: {
      visibility: 'visible'
    },
    slideInContentStyle: {
      visibility: 'visible',
      transitionDuration: `${slideTransitionDurationMillis}ms`,
      transform: `translateX(-100%)`
    }
  }),
  after: slideTransitionDurationMillis => ({
    showSlideInContent: true,
    staticContentStyle: {
      visibility: 'hidden'
    },
    inputBlockerStyle: {
      visibility: 'visible',
      background: 'rgba(0 ,0, 0, 0.25)',
      transitionDuration: `${slideTransitionDurationMillis}ms`
    },
    headerStyle: {
      visibility: 'visible'
    },
    slideInContentStyle: {
      visibility: 'visible',
      transitionDuration: `${slideTransitionDurationMillis}ms`,
      transform: `translateX(-100%)`
    }
  })
};

export const slideOutStates = {
  before: slideTransitionDurationMillis => ({
    showSlideInContent: false,
    staticContentStyle: {
      visibility: 'visible'
    },
    inputBlockerStyle: {
      visibility: 'visible',
      background: 'rgba(0 ,0, 0, 0.25)',
      transitionDuration: `${slideTransitionDurationMillis}ms`
    },
    headerStyle: {
      visibility: 'visible'
    },
    slideInContentStyle: {
      visibility: 'visible',
      transitionDuration: `${slideTransitionDurationMillis}ms`,
      transform: `translateX(-100%)`
    }
  }),
  transition: slideTransitionDurationMillis => ({
    showSlideInContent: false,
    staticContentStyle: {
      visibility: 'visible'
    },
    inputBlockerStyle: {
      visibility: 'visible',
      background: 'rgba(0 ,0, 0, 0)',
      transitionDuration: `${slideTransitionDurationMillis}ms`
    },
    headerStyle: {
      visibility: 'visible'
    },
    slideInContentStyle: {
      visibility: 'visible',
      transitionDuration: `${slideTransitionDurationMillis}ms`,
      transform: `translateX(0%)`
    }
  }),
  after: () => ({
    showSlideInContent: false,
    staticContentStyle: {
      visibility: 'visible'
    },
    inputBlockerStyle: {
      visibility: 'hidden'
    },
    headerStyle: {
      visibility: 'hidden'
    },
    slideInContentStyle: {
      visibility: 'hidden'
    }
  })
};

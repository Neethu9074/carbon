export default {
  id: '1',
  steps: [
    {
      title: 'Welcome to the Instana Tour',
      text: 'This tour is supposed to help you discover Instana and its features.'
    },
    {
      title: 'The Sidebar',
      text: 'You can open it by clicking on the header',
      element: '.in-floating-frame__header'
    },
    {
      title: 'The Sidebar',
      text: 'Here you can see a list of servers and zones',
      element: '.in-floating-frame',
      before() {
        document.querySelector('.in-floating-frame__header').click();
      }
    },
    {
      title: 'The 3D Map',
      text: 'On our 3D map you can see all the cool stuff',
      element: '.in-map'
    },
    {
      title: 'Wow, such logo',
      text: 'And this is our logo',
      element: '.in-root-lettering'
    },
    {
      title: 'Timeline',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
        'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
        'nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis ' +
        'aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
        'nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui ' +
        'officia deserunt mollit anim id est laborum.',
      element: '.in-timeline'
    }
  ]
};

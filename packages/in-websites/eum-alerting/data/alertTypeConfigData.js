export const alertTypes = {
  specificJsError: 'specificJsError',
  slowness: 'slowness'
};

export const alertTypeConfig = Object.freeze([
  {
    type: alertTypes.specificJsError,
    name: 'JS Errors',
    headline: 'Specific JS Errors (Selection)',
    text: 'Alert on known JS Errors by selecting one or multiple JS Errors that have been monitored before.'
  },
  {
    type: alertTypes.slowness,
    name: 'Slowness',
    headline: 'onLoad Time',
    text: `
      <p>
      OnLoad Time measures the time passed in between the user navigating to a website and being able to interact with the website.
      </p>
      <ul>
        <li>Getting all markup, replaced element content and embeds from server</li>
        <li>Parsing the markup</li>
        <li>Applying CSS cascade</li>
        <li>Rendering the page</li>
        <li>Running all scripts that need to run on page load</li>
      <ul>
    `
  }
]);

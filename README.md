# Default Theme

Use this module to get the default theme's variables in your stylesheets:

```css
@import "~bootstrap/less/variables.less";
```

Alternatively, use it as an ES6 module for styles that are applied via JavaScript:

```javascript
import theme from 'instana-ui-default-theme';

// theme.common.fontFamily
// theme.common.fontColor
```

The JavaScript file is build from the LESS file. To update the JavaScript file, simply run `npm run build`.

## Development
It is easy to forget to update the JS file. We can obviously automate this! One simple way is a commit hook. To install the hook, run `npm run installHook`!

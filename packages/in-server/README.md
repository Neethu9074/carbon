# in-server

A small Node.js app responsible for serving of the ui-client.

## Logging

We leverage [pino] in combination with [pino-http] to implement logging.
Whenever you want to log something, prefer usage of `req.log.LEVEL(…)`
over `console.log` or `logger.LEVEL(…)`. By doing so, you ensure that
additional request-specific context is getting logged to stdout. Example:

```js
router.get('/', (req, res) => {
  req.log.warn('Something happened', {
    context: 'foobar'
  });
});
```

For local development we are using [pino-pretty] to pretty-print the JSON
output.

[pino]: https://github.com/pinojs/pino
[pino-pretty]: https://github.com/pinojs/pino-pretty
[pino-http]: https://github.com/pinojs/pino-http

## Error pages to be used as static pages without SSR

To make use of Carbon for IBM Product's error pages, there is a build step to
generate static web pages via rendering react page to static html files.
See [REadme in generate-error-page-content](./generate-error-page-content/README.md)

# Custom Dashboard Widgets

Custom dashboards revolve around widgets. Widgets are small pieces of configurable
presentation logic that are placed in user defined locations on a grid. The custom
dashboard mechanism has several expectations towards widgets that are outlined in
this document. It is essentially a how-to for Widget developers.

## Definition

Widgets are defined in their own directory at `in-custom-dashboards/widgets/{WIDGET_NAME}`. It follows that each widget name must be unique. The custom dashboard mechanism does not attempt to auto discover / scan for widgets. Instead widgets must be registered within the file `in-custom-dashboards/widgets/index.js`.

## Expected Exports

Each widget needs to define the following exports.

- `type`: A unique key for the widget type that must never change. This value is
  used to identify what widget logic to execute for what saved state.
  This value must be unique across all widget types.
- `label`: A human-readable and understandable label that describes this widget type.
  This label will be used in configurators when presenting widget options.
- `ShowCaseComponent`: This must be a React component which is used to render the widget with demo data when selecting a widget.
  This is helpful to show the user how the widget could look like when configured.
- `Widget`: This must be a React component that is used to render the widget within
  a custom dashboard. It gets passed two properties:
  - `title`: This title must be used to render a `Card` as a wrapper around the
    widget. The responsibility to render cards falls to the widget because
    widgets might want to influence the presentation of cards.
  - `actions`: An optional React element that manages the edit/remove/duplicate options.
    When defined, it should be mounted, e.g. within the header of cards.
  - `dragHandle`: An optional React element that renders a drag handle. When defined, it should be mounted,
    e.g. within the header of cards.
  - `config`: All the saved configuration options for this widget. This data is
    whatever was stored in the form created by `createForm`.
  - `isPreview`: Optional bool to indicate whether the widget is rendered in a preview mode.
    Can be used to disable some behavior, e.g. avoiding `height: 100%` usage
    of cards.
- `createForm`: Creates a [formalistic](https://github.com/bripkens/formalistic)
  form to configure a new or edit a previously saved widget
  configuration. It receives the saved configuration (if any) as its
  only parameter.
- `Form`: A React component used to render a visual representation for the
  formalistic form.
  - `form`: A formalistic form which holds the configuration state as created via
    `createForm(…)`.
  - `onChange`: Used to change values within `form`. The signature of `onChange` is
    `onChange(['path', 'to', 'update'], formElement => …);`
  - `setSlideInView`: A function that can be used to trigger a slide-in view across the
    whole dialog. Usage example:
- `badge`: An optional object presented in the widget selector. The object can have the
  following fields:
  - `label`: The badge content to show.

```
<Button
  onClick={() =>
    setSlideInView({
      title: 'My Slide In View',
      getContent({ slideOut }) {
        return (
          <p>
            Hello from my slide in view!
            <Button onClick={slideOut}>Close slide in view</Button>
          </p>
        );
      }
    })
  }
>
  Do something in a slide in view!
</Button>
```

- `minimumWidth`: The minimum number of horizontal grid cells necessary in order to
  render this widget. Users cannot configure the widget to use
  fewer than these number of vertical cells.
- `minimumHeight`: The minimum number of vertical grid cells necessary in order to
  render this widget. Users cannot configure the widget to use
  fewer than these number of vertical cells.
- `enabled`: `true` or `false` to denote whether the widget is visible in the widget
  editor. Please note that this only hides it in the configurator. A persisted
  widget configuration can still cause the widget to be presented.
- `onlyRenderInsideViewport`: When `true` that component will only be mounted once inside
  of the viewport or close to it. Use this to prevent components
  outside of the viewport to be mounted and hence to keep them
  from making (potentially unused) backend requests.
  Defaults to `true`.
- `migrate`: An optional function accepting a saved state object which must return an
  `Observable<Result<MigratedSavedState>>`. You can use this to execute asynchronous
  widget configuration migrations. Migrations will be executed when the widget editor
  is opened and before the form object is created.
- `getTrackingMeta`: An optional function accepting a saved state object used to
  capture information relevant for tracking events.
- `trackViews`: An optional boolean defining whether an event should be raised with
  our end-user monitoring systems whenever the widget is mounted. This event is not
  raised for previews or when the widget is outside of the viewport. Defaults to `false`.

## Configuration Lifecycle

- Creation of new configuration form: `form = createForm(null)`.
- Editing of the new form for users: `<Form form={form} onChange={…} />`.
- Configuration storage: `config = form.toJS()`.
- Editing of saved configuration: `<Form form={createForm(config)} onChange={…} />`.
- Presentation of saved configuration to users: `<Widget title="…" config={config} />`.
- Presentation of demo case to users: `<Widget title="…" config={demo} />`.

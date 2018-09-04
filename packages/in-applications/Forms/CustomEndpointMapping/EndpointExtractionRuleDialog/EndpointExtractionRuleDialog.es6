import { createField, createMapForm } from 'formalistic';
import React, { Fragment } from 'react';

import { build, parse, validate } from 'in-services/validators/urlPath';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './EndpointExtractionRuleDialog.mless';

export default function EndpointExtractionRuleDialog(props) {
  return (
    <Dialog
      customHeaderClassName={locals.customHeader}
      contentWrapperClassName={locals.contentWrapper}
      contentClassName={locals.content}
      customHeader={
        <Fragment>
          <h3 className={locals.title}>Custom Rule</h3>
          <SvgIcon className={locals.cancelIcon} type="lib_openclose_cancel" width={32} height={32} onClick={close} />
        </Fragment>
      }
      onClose={close}
    >
      <BasicDialog {...props} />
    </Dialog>
  );
}

class BasicDialog extends React.Component {
  static displayName = 'BasicDialog';

  constructor(props) {
    super(props);

    this.state = {
      form: getInitialForm(props)
    };
  }

  render() {
    const { onRemove } = this.props;
    const { form } = this.state;

    return (
      <form onSubmit={e => this.onSubmit(e, form)}>
        <div className={locals.queryFormSection}>
          {form.get('query').map(field => (
            <FormGroup>
              <Input
                type="text"
                id="query"
                value={field.value}
                onChange={e => this.onChange('query', e.target.value)}
                hasError={!field.valid}
                autoComplete="off"
                autoFocus
              />
              <TouchedMessages field={field} />
              <span className={locals.queryHelpText}>{`use {param} use *`}</span>
            </FormGroup>
          ))}
        </div>

        <div className={locals.footer}>
          <Button kind="create" type="submit" disabled={!form.hierarchyValid}>
            Save
          </Button>
          {onRemove && (
            <Button
              style={{ marginLeft: 0 }}
              kind="subtle"
              size="compact"
              icon="lib_actions_delete"
              onClick={() => {
                close();
                onRemove();
              }}
            >
              Delete Rule
            </Button>
          )}
        </div>
      </form>
    );
  }

  onSubmit(e, form) {
    e.preventDefault();

    if (!form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    close();

    const rule = form.toJS();
    rule.query = parse(rule.query);
    this.props.onSave(rule);
  }

  onChange = (fieldName, value) => {
    this.setState({
      form: this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true))
    });
  };
}

function getInitialForm(props) {
  const rule = props.rule || {};
  const query = build(rule.query);

  return createMapForm().put(
    'query',
    createField({
      value: query,
      validator: queryValidator
    })
  );
}

function queryValidator(query) {
  if (isBlank(query)) {
    return [
      {
        severity: 'error',
        message: 'The value must not be blank.'
      }
    ];
  }

  return validate(parse(query));
}

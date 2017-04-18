import rpt from 'prop-types';
import React from 'react';

import './EditableTextInput.less';

const block = 'in-editable-text-input';

export default class extends React.Component {
  static displayName = 'EditableTextInput';

  static propTypes = {
    text: rpt.string.isRequired,
    onSave: rpt.func.isRequired
  };

  state = {
    text: this.props.text,
    editMode: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text) {
      this.setState({ text: nextProps.text });
    }
  }

  render() {
    const editMode = this.state.editMode;
    const text = this.state.text;

    return (
      <div>
        {editMode
          ? <input
              type="text"
              className={`in-input ${block}__input`}
              value={text}
              onChange={e => this.setState({ text: e.target.value })}
            />
          : <div className={`${block}__simple-input`}>
              {this.props.text}
            </div>}
        <div>
          <span className={`${block}__control`} onClick={() => this.setState({ editMode: !this.state.editMode })}>
            {editMode ? 'Cancel' : 'Edit'}
          </span>
          {editMode
            ? <span
                className={`${block}__control`}
                onClick={() => {
                  this.setState({ editMode: false });
                  this.props.onSave(text);
                }}
              >
                Save
              </span>
            : null}
        </div>
      </div>
    );
  }
}

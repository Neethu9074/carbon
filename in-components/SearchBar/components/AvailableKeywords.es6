import React from 'react';

import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import {fieldsCategorized} from 'in-stores/search/fields';
import SvgIcon from 'in-components/SvgIcon';

import './AvailableKeywords.less';

const block = 'in-search-available-keywords';
const listClassName = `${block}__list`;

const Node = React.createClass({
  getInitialState() {
    return {
      expanded: false
    };
  },

  render() {
    const children = this.props.node.children;
    const fields = this.props.node.fields;

    return (
      <li>
        <a href=''
           onClick={this.toggle}
           className={`${block}__expand`}>

          <SvgIcon type={this.state.expanded ? 'triangle_down' : 'triangle_right'}
                   width={this.state.expanded ? 9.8 : 7}
                   className={`${block}__expand-icon`} />
          {this.props.node.name}
        </a>

        {children.length > 0 && this.state.expanded ?
          <ul className={listClassName}>
            {children.map(child =>
              <Node node={child}
                    key={child.name} />
            )}
          </ul>
        : null}

        {fields.length > 0 && this.state.expanded  ?
          <ul className={listClassName}>
            {fields.map(field =>
              <Field field={field}
                     key={field.keyword} />
            )}
          </ul>
        : null}
      </li>
    );
  },

  toggle(e) {
    e.preventDefault();
    this.setState({expanded: !this.state.expanded});
  }
});


export default function AvailableKeywords() {
  return (
    <div className={block}>
      <MenuHeading>
        Available Search Keywords
      </MenuHeading>

      <ul className={listClassName}>
        {fieldsCategorized.children.map(node =>
          <Node node={node}
                key={node.name} />
        )}
      </ul>
    </div>
  );
}


function Field({field}) {
  return (
    <li>{field.keyword}</li>
  );
}

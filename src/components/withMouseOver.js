// @flow
import React from 'react';
import type { ComponentType } from 'react';

export default function withMouseOver(Component: ComponentType<*>) {
  return class extends React.Component
    <{}, { mouseover: boolean }> 
  {
    state = { mouseover: false };

    render() {
      return (
        <span 
          onMouseEnter={() => this.setState({ mouseover: true })}
          onMouseLeave={() => this.setState({ mouseover: false }) }
        >
          <Component mouseover={this.state.mouseover} {...this.props} />
        </span>
      );
    }
  }
}

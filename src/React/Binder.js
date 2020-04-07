import React, { Component } from 'react';
import PropTypes from 'prop-types';

const stdProps = ['error', 'label', 'value', 'required']
const anyProps = ['error', 'label', 'value', 'required', 'onBlur']

function handleBinder(parentProps, props, opts) {
  const newProps = {};
  const methods = Object.getOwnPropertyNames(parentProps);
  // expand std
  if (methods.indexOf('std') !== -1) {
    parentProps = Object.assign({}, parentProps);
    stdProps.forEach(method => { parentProps[method] = parentProps.std; });
    delete parentProps.std;
    methods = Object.getOwnPropertyNames(parentProps);
  }
  // apply binder
  methods.forEach(method => {
    if (method === 'opts' || method === 'children') return;
    if (anyProps.indexOf(method) === -1) {
      newProps[method] = parentProps[method];
      return;
    }
    const binder = parentProps[method];
    if (!binder) return;
    if (typeof binder[`${method}Props`] === 'function') binder[`${method}Props`](props, params, newProps);
    else if (props[method] === undefined && typeof binder[`${method}For`] === 'function') newProps[method] = binder[`${method}For`](props.id, opts);
  });
  return newProps;
}

function deepClone(parentProps, children, opts, wasFound) {
  return !wasFound ? React.Children.map(children, child => {
    if (!child || !child.props) return child;
    const found = React.isValidElement(child) && child.props.id;
    const childProps = found ? handleBinder(parentProps, child.props, opts) : {};
    const children = deepClone(parentProps, child.props.children, opts, found);
    if (children) childProps.children = children;
    return React.cloneElement(child, childProps);
  }) : children;
}

export default class Binder extends Component {
  render() {
    const opts = this.props.opts;
    return deepClone(this.props, this.props.children, opts, false);
  }
}

Binder.propTypes = {
  std: PropTypes.object,
  error: PropTypes.object,
  label: PropTypes.object,
  value: PropTypes.object,
  required: PropTypes.object,
  onBlur: PropTypes.object,
  opts: PropTypes.object,
};

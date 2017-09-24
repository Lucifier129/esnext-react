/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
 */

'use strict';
jest.dontMock('../src');
var React = require('../src');
var ReactDOM = require('../src');
var ReactTestUtils = {
  renderIntoDocument: function(instance) {
        var div = document.createElement('div');
        return ReactDOM.render(instance, div);
      }
  };

describe('Render Select with multiple values', function() {
  class Component extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {selectedValue: [1,3,4]};
    }

    render() {
      return <div>
        <select value={this.state.selectedValue} ref="selectNode" id="selectNode" multiple>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
        {this.state.selectedValue}
        </div>;
    }
  }

  it('should mark correct option as selected', function() {
    var instance = ReactTestUtils.renderIntoDocument(<Component />);
    var root = ReactDOM.findDOMNode(instance);
    // NOTE: If the new version of Jest this should be ".selected"
    expect(root.childNodes[0].options[0]._selectedness).toBe(true);
    expect(root.childNodes[0].options[1]._selectedness).toBe(false);
    expect(root.childNodes[0].options[2]._selectedness).toBe(true);
    expect(root.childNodes[0].options[3]._selectedness).toBe(true);
  });

});

describe('Render Select with single value', function() {
  class Component extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {selectedValue: 2};
    }

    render() {
      return <div>
        <select value={this.state.selectedValue} ref="selectNode" id="selectNode">
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
        {this.state.selectedValue}
        </div>;
    }
  }

  it('should mark correct option as selected', function() {
    var instance = ReactTestUtils.renderIntoDocument(<Component />);
    var root = ReactDOM.findDOMNode(instance);

    expect(root.childNodes[0].options[0]._selectedness).toBe(false);
    expect(root.childNodes[0].options[1]._selectedness).toBe(true);
    expect(root.childNodes[0].options[2]._selectedness).toBe(false);
    expect(root.childNodes[0].options[3]._selectedness).toBe(false);
  });

});

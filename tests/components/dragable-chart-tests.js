import test from 'tape';
import React from 'react';
import {mount} from 'enzyme';
import DragableExample from '../../showcase/examples/dragable-chart/dragable-chart-example';

test('Showcase Examples: DragableExample', t => {
  const $ = mount(<DragableExample />).setState({width: 500});

  t.equal($.find('.drag-marker').exists(), false, 'should not have drag marker before clicking');

  $.find('.rv-voronoi__cell').at(25).simulate('mouseDown', {});
  $.find('.rv-voronoi__cell').at(50).simulate('mouseOver', {});

  t.equal($.find('.drag-marker').exists(), true, 'should have drag marker after clicking');
  t.equal($.find('.drag-marker').props().x, 160, 'should have correct x position for drag marker');
  t.equal($.find('.drag-marker').props().width, 110, 'should have correct width for drag marker');

  $.find('.rv-voronoi__cell').at(75).simulate('mouseOver', {});

  t.equal($.find('.drag-marker').props().x, 160, 'should keep the x position for drag marker');
  t.equal($.find('.drag-marker').props().width, 220, 'should increase the with for drag marker');

  $.find('.rv-voronoi__cell').at(75).simulate('mouseUp', {});

  t.equal($.find('.drag-marker').exists(), false, 'should not have drag marker after releasing');
  t.end();
});

test('Showcase Examples: DragableExample - Touch Example', t => {
  const $ = mount(<DragableExample />).setState({width: 500});

  // Because JSDOM has no layout engine, there is no way to implement a polyfill
  // for document.elementFromPoint(). To get around this issue we monkey patch the
  // function and return the voronoi cell at the provided x/y.
  //
  // See https://github.com/jsdom/jsdom/issues/1435 for JSDOM limitation
  const monkeyPatchElementFromPoint = (at) => {
    document.elementFromPoint = () => $.find('.rv-voronoi__cell').at(at).getDOMNode();
  };

  t.equal($.find('.drag-marker').exists(), false, 'should not have drag marker before clicking');

  monkeyPatchElementFromPoint(25);
  $.find('.rv-voronoi').simulate('touchStart', {nativeEvent: {pageX: 125, pageY: 100}});
  monkeyPatchElementFromPoint(50);
  $.find('.rv-voronoi').simulate('touchMove', {nativeEvent: {pageX: 250, pageY: 100}});

  t.equal($.find('.drag-marker').exists(), true, 'should have drag marker after clicking');
  t.equal($.find('.drag-marker').props().x, 160, 'should have correct x position for drag marker');
  t.equal($.find('.drag-marker').props().width, 110, 'should have correct width for drag marker');

  monkeyPatchElementFromPoint(75);
  $.find('.rv-voronoi').simulate('touchMove', {nativeEvent: {pageX: 375, pageY: 100}});

  t.equal($.find('.drag-marker').props().x, 160, 'should keep the x position for drag marker');
  t.equal($.find('.drag-marker').props().width, 220, 'should increase the with for drag marker');

  monkeyPatchElementFromPoint(75);
  $.find('.rv-voronoi').simulate('touchEnd', {nativeEvent: {pageX: 375, pageY: 100}});

  t.equal($.find('.drag-marker').exists(), false, 'should not have drag marker after releasing');
  t.end();

  document.elementFromPoint = null;
});

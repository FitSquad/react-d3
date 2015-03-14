'use strict';

var React = require('react');
var Legend = require('./legend').Legend;

var PlainChart = React.createClass({displayName: "PlainChart",
  render: function() {
    var title = this.props.title;
    var titleTag = title && React.createElement("h4", null, this.props.title);
    return (
      React.createElement("div", null, 
        titleTag, 
        React.createElement("svg", {width: this.props.width, height: this.props.height}, this.props.children)
      )
    );
  }
});

var LegendChart = React.createClass({displayName: "LegendChart",

  propTypes: {
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    sideOffset: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      data: {},
      legend: false,
      legendPosition: 'right',
      sideOffset: 90
    };
  },

  _renderLegend: function() {
    if (this.props.legend) {
      return (
        React.createElement(Legend, {
          legendPosition: this.props.legendPosition, 
          margins: this.props.margins, 
          colors: this.props.colors, 
          data: this.props.data, 
          width: this.props.width, 
          height: this.props.height, 
          sideOffset: this.props.sideOffset}
        ) 
      );
    }
  },

  render: function() {
    return (
      React.createElement("div", {style: {'width': this.props.width, 'height': this.props.height}}, 
        React.createElement("h4", null, this.props.title), 
        this._renderLegend(), 
        React.createElement("svg", {width: this.props.width - this.props.sideOffset, height: this.props.height}, this.props.children)
      )
    );
  }
});

exports.LegendChart = LegendChart;

exports.Chart = React.createClass({displayName: "Chart",

  propTypes: {
    legend: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      legend: false
    };
  },

  render: function() {
    if (this.props.legend) {
      return React.createElement(LegendChart, React.__spread({},  this.props));
    }
    return React.createElement(PlainChart, React.__spread({},  this.props));
  }

});


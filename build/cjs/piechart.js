'use strict';

var React = require('react');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Arc = React.createClass({displayName: "Arc",

  getDefaultProps: function() {
    return {
      labelStrokeWidth: 2,
      labelTextFill: "black",
      valueTextFill: "white"
    };
  },

  propTypes: {
    fill: React.PropTypes.string,
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number
  },

  render: function() {
    var props = this.props;
    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);
    var rotate = "rotate(" + (props.startAngle+props.endAngle)/2 * (180/Math.PI) + ")";
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist   = radius + 35;
    var angle  = (props.startAngle + props.endAngle) / 2;
    var x      = dist * (1.2 * Math.sin(angle));
    var y      = -dist * Math.cos(angle);
    var t = "translate(" + x + "," + y + ")";

    return (
      React.createElement("g", {className: "arc-group"}, 
        React.createElement("path", {
          className: "arc", 
          d: arc(), 
          fill: props.fill}
        ), 
        React.createElement("line", {
          className: "arc-line", 
          x1: "0", 
          x2: "0", 
          y1: -radius - 2, 
          y2: -radius - 26, 
          stroke: "black", 
          transform: rotate, 
          style: {
            "fill": props.labelTextFill,
            "strokeWidth": props.labelStrokeWidth,
          }}, 
        ">"
        ), 
        React.createElement("text", {
          className: "arc-label-text", 
          transform: t, 
          dy: ".35em", 
          style: {
            "textAnchor": "middle",
            "fill": props.labelTextFill,
            "shapeRendering": "crispEdges"
          }}, 
          props.label
        ), 
        React.createElement("text", {
          className: "arc-value-text", 
          transform: "translate(" + arc.centroid() + ")", 
          dy: ".35em", 
          style: {
            "shapeRendering": "crispEdges",
            "textAnchor": "middle",
            "fill": props.valueTextFill
          }}, 
          props.value + "%"
        )
      )
    );
  }
});

var DataSeries = React.createClass({displayName: "DataSeries",

  propTypes: {
    transform: React.PropTypes.string,
    data: React.PropTypes.array,
    innerRadius: React.PropTypes.number,
    radius: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      innerRadius: 0,
      data: [],
      color: d3.scale.category20c()
    };
  },

  render: function() {

    var props = this.props;

    var pie = d3.layout
      .pie()
      .sort(null);

    var arcData = pie(props.data);

    var color = props.color;

    var arcs = arcData.map(function(arc, i) {
      return (
        React.createElement(Arc, {
          startAngle: arc.startAngle, 
          endAngle: arc.endAngle, 
          outerRadius: props.radius, 
          innerRadius: props.innerRadius, 
          labelStrokeWidth: props.labelStrokeWidth, 
          labelTextFill: props.labelTextFill, 
          valueTextFill: props.valueTextFill, 
          fill: color(i), 
          label: props.labels[i], 
          value: props.data[i], 
          key: i, 
          width: props.width}
        )
      );
    });
    return (
      React.createElement("g", {className: "pie-group", transform: props.transform}, arcs)
    );
  }
});

var PieChart = exports.PieChart = React.createClass({displayName: "PieChart",

  getDefaultProps: function() {
    return {
      title: ''
    };
  },

  propTypes: {
    radius: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string,
    color: React.PropTypes.func,
    title: React.PropTypes.string
  },

  render: function() {
    var props = this.props;
    var transform = "translate(" +
      (props.cx || props.width/2) + "," +
      (props.cy || props.height/2) + ")";

    var data = props.data.map( function(item)  {return item.value;} );
    var labels = props.data.map( function(item)  {return item.label;} );

    return (
      React.createElement(Chart, {
        className: "pie-chart", 
        width: props.width, 
        height: props.height, 
        title: props.title
      }, 
        React.createElement(DataSeries, {
          labelStrokeWidth: props.labelStrokeWidth, 
          labelTextFill: props.labelTextFill, 
          valueTextFill: props.valueTextFill, 
          labels: labels, 
          color: props.color, 
          transform: transform, 
          data: data, 
          width: props.width, 
          height: props.height, 
          radius: props.radius, 
          innerRadius: props.innerRadius}
        )
      )
    );
  }

});

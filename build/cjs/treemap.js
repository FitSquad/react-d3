'use strict';

var React = require('react');
var d3 = require('d3');
var Chart = require('./common').Chart;

var Cell = React.createClass({displayName: "Cell",

  propTypes: {
    cellColor: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    label: React.PropTypes.string
  },

  render: function() {
    
    var textStyle = {
      'textAnchor': 'middle',
      'fill': this.props.textColor,
      'fontSize': this.props.fontSize
    };

    var t = 'translate(' + this.props.x + ',' + this.props.y + ')';

    return (
      React.createElement("g", {transform: t}, 
        React.createElement("rect", {
          fill: this.props.cellColor, 
          width: this.props.width, 
          height: this.props.height}
        ), 
        React.createElement("text", {
          x: this.props.width / 2, 
          y: this.props.height / 2, 
          dy: ".35em", 
          style: textStyle
        }, 
          this.props.label
        )
      )
    );
  }
});

var DataSeries = React.createClass({displayName: "DataSeries",
  
  propTypes: {
    data: React.PropTypes.array,
    value: React.PropTypes.string
  },
 
  getDefaultProps: function() {
    return {
      data: [],
      value: 'value',
      label: 'label'
    };
  },

  render: function() {
    
    var data = this.props.data;
    var value = this.props.value;
    var label = this.props.label;

    var color = d3.scale.category20c();

    var treemap = d3.layout.treemap()
                    // make sure calculation loop through all objects inside array 
                    .children(function(d) { return d; })
                    .size([this.props.width, this.props.height])
                    .sticky(true)
                    .value(function(d) { return d[value]; });
    
    var cells = treemap(data).map(function(node, i) {
      return (
        React.createElement(Cell, {
          x: node.x, 
          y: node.y, 
          width: node.dx, 
          height: node.dy, 
          cellColor: color(i), 
          label: node[label], 
          key: i}
        ) 
      ); 
    }, this);

    return (
      React.createElement("g", {transform: this.props.transform, className: "treemap"}, 
        cells
      )
    );
  }

});

var Treemap = React.createClass({displayName: "Treemap",

  propTypes: {
    margins: React.PropTypes.object,
    data: React.PropTypes.array, 
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontSize: React.PropTypes.oneOfType([ 
      React.PropTypes.string,
      React.PropTypes.number
    ])

  },

  getDefaultProps: function() {
    return {
      data: [], 
      width: 400,
      heigth: 200,
      title: '',
      textColor: '#f7f7f7',
      fontSize: '0.65em'
    };
  },

  render: function() {
    
    return (
      React.createElement(Chart, {
        title: this.props.title, 
        width: this.props.width, 
        height: this.props.height
      }, 
        React.createElement(DataSeries, {
          width: this.props.width, 
          height: this.props.height, 
          data: this.props.data, 
          textColor: this.props.textColor, 
          fontSize: this.props.fontSize}
        )
      )
    );
  }

});

exports.Treemap = Treemap;

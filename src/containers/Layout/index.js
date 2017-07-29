import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Layout extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.title !== this.props.navigation.title) {
      document.title = nextProps.navigation.title;
    }
  }

  render() {
    return (
      <div id="app-wrapper" className="layout">
        <div id="content" className="layout__content">
          {this.props.children}
        </div>
        <div id="footer" className="layout__footer">
          <div className="page-wrapper">
            <span>
              Created with ❤ by <a
                href="https://github.com/mmellado/"
                rel="noopener noreferrer"
                target="_blank"
              >
                @mmellado
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
  };
}

// Passing the pure parameter as false as this component is wrapping a wrapper. This is likely not
// needed for other uses of connect(). More about connect:
// https://github.com/reactjs/react-redux/blob/master/docs/api.md
export default connect(mapStateToProps, null, null, { pure: false })(Layout);
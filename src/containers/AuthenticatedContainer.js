import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Header from '../components/common/Header';

class AuthenticatedContainer extends React.Component {
  componentDidMount() {
    const { isAuthenticated } = this.props;

    if (! isAuthenticated) browserHistory.push('login');
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

AuthenticatedContainer.propTypes = {
    children: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
}

export default connect(mapStateToProps)(AuthenticatedContainer);

import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { CircularProgress, Typography } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Shared services
import { getAccount } from 'services/user';

// Custom components
import { AccountToolbar, AccountTable } from './components';

// Component styles
import styles from './style';

class RecordList extends Component {
  signal = true;

  state = {
    isLoading: false,
    limit: 10,
    Account: [],
    selectedAccount: [],
    error: null
  };

  

  componentDidMount() {
    this.signal = true;
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSelect = selectedAccount => {
    this.setState({ selectedAccount });
  };

  renderAccount() {
    const { classes } = this.props;
    const { isLoading, Account, error } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    return (
      <AccountTable
        //
        onSelect={this.handleSelect}
        Account={Account}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { selectedAccount } = this.state;

    return (
      <DashboardLayout title="Account">
        <div className={classes.root}>
          <AccountToolbar selectedAccount={selectedAccount} />
          <div className={classes.content}>{this.renderAccount()}</div>
        </div>
      </DashboardLayout>
    );
  }
}

RecordList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecordList);

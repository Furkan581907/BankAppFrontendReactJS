import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import $ from 'jquery';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField } from '@material-ui/core';
import global from '../../../../global';
// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Component styles
import styles from './styles';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  }
];

class Account extends Component {
  state = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'contact@devias.io',
    phone: '',
    state: 'Alabama',
    country: 'USA'
  };

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };
  AuthenticationControl()
  {
    debugger;
    let userData = global.user;
    let nickName,Id;
    userData.map((item, key) =>
    nickName=item.nickname)
    let data={
      Nickname:nickName
    }
  let self = this;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:32771/api/Authenticator/authenticatorImage",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Access-Control-Allow-Origin": "http://localhost:32771",
      "Cache-Control": "no-cache",
      "cache-control": "no-cache"
    },
    "processData": false,
    "data": JSON.stringify(data)
  }
  
  $.ajax(settings).done(function (response) {
    console.log(nickName);
  });
  }
  render() {
    const { classes, className, ...rest } = this.props;
    const { firstName, lastName, phone, state, country, email } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="The information can be edited"
            title="Profile"
          />
        </PortletHeader>
        <PortletContent noPadding>
          <form
            autoComplete="off"
            noValidate
          >
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                helperText="Please specify the first name"
                label="First name"
                margin="dense"
                required
                value={firstName}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label="Last name"
                margin="dense"
                required
                value={lastName}
                variant="outlined"
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Email Address"
                margin="dense"
                required
                value={email}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label="Phone Number"
                margin="dense"
                type="number"
                value={phone}
                variant="outlined"
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Select State"
                margin="dense"
                onChange={this.handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={state}
                variant="outlined">
                {states.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
              <TextField
                className={classes.textField}
                label="Country"
                margin="dense"
                required
                value={country}
                variant="outlined"
              />
            </div>
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={this.AuthenticationControl.bind(this)}
          >
            İki Adımlı Doğrulama
          </Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Account);

import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';
import $ from 'jquery';
import global from '../../../../global';
import Swal from 'sweetalert2'

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Checkbox, Typography, Button,Input } from '@material-ui/core';

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

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.isAuthentication = false;
    this.state.userData = global.user;
    this.state.qrImageLink="";
    this.state.secretKey="";
    this.state.manuelEntryKey="";
    this.state.priceValue='';
    this.state.testCode='';
  }
  handleChange = e => {
    this.setState({
      testCode: e.target.value
    });
  };
  AuthenticationControlOpen()
  {
    let userData = global.user;
    let nickName;
    nickName = userData.nickname;
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
    self.setState({qrImageLink:response.qrCodeSetupImageUrl,secretKey:response.accountSecretKey,manuelEntryKey:response.manualEntryKey,isAuthentication:true});

    console.log(response);
  });
  }
  autTest()
  {
    let userData = global.user;
    let nickName,id;
    nickName = userData.nickname;
    id = userData.id;
    let data={
      userName:nickName,
      userId:id,
      secretKey:this.state.secretKey,
      manuelKey:this.state.manuelEntryKey,
      imageLink:this.state.qrImageLink,
      testValue:this.state.testCode
    }
  let self = this;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:32771/api/Authenticator/authenticatorTest",
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
    if(response =="Başarılı")
    {
      Swal.fire('İşlem Başarılı',
      "İki Adımlı Giriş Başarılı. Giriş Yap'a Yönlendiriliyorsunuz!",
      'success'
    );
  }
    else{
      Swal.fire('Hata',
      "Girdiğiniz Kod Hatalıdır. Yeni bir QR Kod ile tekrar deneyin.",
      'error'
    );
    }
    console.log(response);
  });
  }
  render() {
    const { classes, className, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="Authenticator"
            title="İki Adımlı Doğrulama"
          />
        </PortletHeader>
        <PortletContent noPadding>
        <div>İki Adımlı Doğrulama = {this.state.userData.twoFactorAuthenticator ? "Açık" : "Kapalı"}
          </div>
          {this.state.userData.twoFactorAuthenticator ? <div><Button
            color="primary"
            variant="outlined"
            onClick={this.AuthenticationControlClose.bind(this)}
          >
            Kapa
          </Button></div> :<div> <Button
            color="primary"
            variant="outlined"
            onClick={this.AuthenticationControlOpen.bind(this)}
          >
            Aç
          </Button>
          </div>}
        
          {this.state.isAuthentication &&
          <div>
            <img src={this.state.qrImageLink} />
            <div>
            <table>
            <tr>
                  <td>Test Kodu : </td>
                  <td><Input type="text" name="balance" onChange={this.handleChange.bind(this)}/></td>
                  </tr>
                  <tr>
                  <td><Button color="primary"
            variant="outlined" onClick={this.autTest.bind(this)}>Test Et</Button></td>
                  </tr>
                </table>
            </div>
          </div>
          
          }
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          
        </PortletFooter>
      </Portlet>
    );
  }
}

Notifications.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Notifications);

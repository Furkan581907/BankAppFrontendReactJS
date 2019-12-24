import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';
import $ from 'jquery';
import Swal from 'sweetalert2'
// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared utilities
import validators from 'common/validators';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';

validate.validators.checked = validators.checked;

// Service methods
const signUp = () => {
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.state.values=[];
    this.state.touched=[];
    this.state.errors=[];
    this.state.isValid=false;
    this.state.isLoading=false;
    this.state.submitError=null;
    this.state.userData=[];
    this.state.tcno='';
    this.state.telefon='';
    this.state.adsoyad='';
    let KullaniciAdi='';
    let Sifre='';
    let valueData=[KullaniciAdi,Sifre];
    this.state.values=valueData;
    let touchedData=[KullaniciAdi=false,Sifre=false];
    this.state.touched=touchedData;
    let errorsData=[KullaniciAdi=null,Sifre=null];
    this.state.errors=errorsData;
  }

  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };
  handleChangeTC(event)
  {
    let cevir = event.target.value.replace(/[^0-9]/g, "").slice(0,11);
    this.setState({tcno:cevir});
  }
  handleChangeTel(event)
  {
    let cevir = event.target.value.replace(/[^0-9]/g, "").slice(0,11);
    this.setState({telefon:cevir});
  }
  handleChangeAdSoyad(event)
  {
    
    this.setState({adsoyad:event.target.value});
      
  }

    
  handleSignUp = async () => {
    try {
      const { history } = this.props;
      const { values } = this.state;
      this.setState({ isLoading: true });
      let data ={
        CustomerTckn:this.state.tcno,
        NameSurname:this.state.adsoyad,
        Password:values.Password,
        PhoneNumber:this.state.telefon
      };
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:58877/api/Customer/register",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Access-Control-Allow-Origin": "http://localhost:58877",
          "Cache-Control": "no-cache",
          "Host": "localhost:58877",
          "Accept-Encoding": "gzip, deflate",
          "Content-Length": "104",
          "Connection": "keep-alive",
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(data)
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        if(response=="Kayıt Başarılı")
        {
          Swal.fire('Kayıt Başarılı!',
            'Şimdi Giriş Yapın!',
            'success'
          )
        history.push('/sign-in');
        }
        else if(response=="ayni")
        {
          Swal.fire('Kullanıcı Mevcut!',
            'Tekrar Deneyin!',
            'error'
          )
        }
        else
        {
          Swal.fire('Kayıt Hatası!',
            'Tekrar Deneyin!',
            'error'
          )
        }
      });
      
      await signUp({
        CustomerTckn: values.CustomerTckn,
        Password: values.Password,
        KullaniciAdi:values.KullaniciAdi,
        PhoneNumber: values.PhoneNumber,
        Sifre: values.Sifre
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        serviceError: error
      });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading
    } = this.state;

    const showCustomerTcknError =
      touched.CustomerTckn && errors.CustomerTckn ? errors.CustomerTckn[0] : false;
    const showNameSurnameError =
      touched.NameSurname && errors.NameSurname ? errors.NameSurname[0] : false;
    const showPasswordError =
      touched.Password && errors.Password ? errors.Password[0] : false;
    const showPhoneNumberError =
    touched.PhoneNumber && errors.PhoneNumber ? errors.PhoneNumber[0]:false;

    return (
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          <Grid
            className={classes.quoteWrapper}
            item
            lg={5}
          >
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography
                  className={classes.quoteText}
                  variant="h1"
                >
                 M4A Bank Kayıt Ol !
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    
                  </Typography>
                  <Typography
                    className={classes.bio}
                    variant="body2"
                  >
                    
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
          >
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Yeni bir hesap aç !
                  </Typography>
                  <Typography
                    className={classes.subtitle}
                    variant="body1"
                  >
                    Ücretsiz bir hesap açın
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="TC Kimlik No:"
                      name="CustomerTckn"
                      onChange={this.handleChangeTC.bind(this)}
                      value={this.state.tcno}
                      variant="outlined"
                    />
                    {showCustomerTcknError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.CustomerTckn[0]}
                      </Typography>
                    )}
                    <TextField
                      className={classes.textField}
                      label="Şifre :"
                      type="password"
                      onChange={event =>
                        this.handleFieldChange('Password', event.target.value)
                      }
                      value={values.Password}
                      variant="outlined"
                    />
                    {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.Password[0]}
                      </Typography>
                    )}
                    
                    <TextField
                      className={classes.textField}
                      label="Ad Soyad :"
                      onChange={this.handleChangeAdSoyad.bind(this)}
                      value={this.state.adsoyad}
                      variant="outlined"
                    />
                    {showNameSurnameError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.NameSurname[0]}
                      </Typography>
                    )}
                    <TextField
                      className={classes.textField}
                      label="Telefon Numarası"
                      name="PhoneNumber"
                      onChange={this.handleChangeTel.bind(this) }
                      value={this.state.telefon}
                      variant="outlined"
                    />
                    {showPhoneNumberError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.PhoneNumber[0]}
                      </Typography>
                    )}
                    
                    
                  </div>
                  {submitError && (
                    <Typography
                      className={classes.submitError}
                      variant="body2"
                    >
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                    <Button
                      className={classes.signUpButton}
                      color="primary"
                      disabled={isValid}
                      onClick={this.handleSignUp}
                      size="large"
                      variant="contained"
                    >
                      Şimdi Kayıt Ol !
                    </Button>
                  )}
                  <Typography
                    className={classes.signIn}
                    variant="body1"
                  >
                    Bir hesabınız var mı ?{' '}
                    <Link
                      className={classes.signInUrl}
                      to="/sign-in"
                    >
                      Giriş Yap
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignUp.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(SignUp);

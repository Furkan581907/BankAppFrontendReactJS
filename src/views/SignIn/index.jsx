import React, { Component } from 'react';
import { Link, withRouter,Redirect } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';
import $ from 'jquery';
import Swal from 'sweetalert2'
import global from '../../global'

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';

// Component styles
import styles from './styles';
import Modal from 'react-modal';

// Form validation schema
import schema from './schema';

// Service methods
const signIn = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 :'50%'
  }
};
class SignIn extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.state.values=[];
    this.state.touched=[];
    this.state.errors=[];
    this.state.isValid=false;
    this.state.isLoading=false;
    this.state.submitError=null;
    let userName='';
    this.state.tcno ='';
    let password='';
    let valueData=[userName,password];
    this.state.values=valueData;
    let touchedData=[userName=false,password=false];
    this.state.touched=touchedData;
    let errorsData=[userName=null,password=null];
    this.state.errors=errorsData;

  }
  componentWillMount() {
  }

  componentWillUnmount() {
  }
  componentDidMount() {
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

  handleSignIn = async () => {
    try {
      let self = this;
      const { history } = this.props;
      const { values } = this.state;
      this.setState({ isLoading: true });
      let data ={
        Password:values.password,
        CustomerTckn:this.state.tcno
      };
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:58877/api/Customer/login",
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
        if(response=="Hatalı")
        {
          Swal.fire('HATA!',
            'Hatalı Kullanıcı Adı veya Şifre!',
            'error'
          ); 
        }
        else
        {
          Swal.fire('Giriş Yapıldı',
            'Giriş Başarıyla Yapıldı!',
            'success'
          );
          global.user = response;
          console.log(global.user);
          history.push('/dashboard');
        }
      });
        localStorage.setItem('isAuthenticated', true);

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

    const showUserNameError = touched.userName && errors.userName;
    const showPasswordError = touched.password && errors.password;

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
                  M4A Bankasına HOŞGELDİNİZ
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
                    HOŞGELDİNİZ
                  </Typography>
                  
                  
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="TC Kimlik No"
                      name="userName"
                      onChange={this.handleChangeTC.bind(this)}
                      type="text"
                      value={this.state.tcno}
                      variant="outlined"
                    />
                    {showUserNameError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.userName[0]}
                      </Typography>
                    )}
                    <TextField
                      className={classes.textField}
                      label="Şifre"
                      name="password"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                    {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.password[0]}
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
                  
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      disabled={isValid}
                      onClick={this.handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      Giriş Yap
                    </Button>
                  
                  <Typography
                    className={classes.signUp}
                    variant="body1"
                  >
                    Hesabınız Yok mu ? Yeni bir hesap aç !{' '}
                    <Link
                      className={classes.signUpUrl}
                      to="/sign-up"
                    >
                      Kayıt Ol !
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

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(SignIn);

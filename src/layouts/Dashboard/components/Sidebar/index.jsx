import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import global from '../../../../global'
// Material helpers
import { withStyles } from '@material-ui/core';
import Modal from 'react-modal';
import $ from 'jquery';
import Swal from 'sweetalert2';


// Material components
import {
  Paper, AppBar, Toolbar, MenuItem, InputLabel, Select, ListItemAvatar, TextField, Fab, InputBase, IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  Button,
  Input
} from '@material-ui/core';

// Material icons
import {
  DashboardOutlined as DashboardIcon,
  PeopleOutlined as PeopleIcon,
  ShoppingBasketOutlined as ShoppingBasketIcon,
  DriveEtaRounded as DriveEtaRoundedIcon,
  LockOpenOutlined as LockOpenIcon,
  TextFields as TextFieldsIcon,
  ImageOutlined as ImageIcon,
  InfoOutlined as InfoIcon,
  ImportExportRounded as ImportExportIcon,
  AccountBoxOutlined as AccountBoxIcon,
  SettingsOutlined as SettingsIcon
} from '@material-ui/icons';

// Component styles
import styles from './styles';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%'
  }
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.userData = global.user;
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal1 = this.openModal1.bind(this);
    this.afterOpenModal1 = this.afterOpenModal1.bind(this);
    this.closeModal1 = this.closeModal1.bind(this);
    this.state.hesapBakiyesi = 0;
    this.state.addaccnumber=0;
    this.state.priceValue = '';
    this.state.allAccount = [];
    this.state.sendHesapTuru = 0;
    window.updateUserData = this.updateUserData.bind(this);
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  openModal1() {
    this.setState({ modalIsOpen1: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false, totalPrice: 0 });
  }
  afterOpenModal1() {
    // references are now sync'd and can be accessed.
  }

  closeModal1() {
    this.setState({ modalIsOpen1: false, totalPrice: 0 });
  }
  updateUserData() {
    this.setState({
      userData: global.user
    });
  }
  handleChange(event) {
    const onlyNums = event.target.value;
      this.setState({ priceValue: onlyNums });
    
  }
  componentDidMount() {
    this.loadData();
    this.signal = true;


  }
  loadData() {
    let self = this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data = {
      CustomerTckn: userId,
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/Account/AllAccount",
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
      self.setState({ allAccount: response });
    });
  }
  renderBalanceType(type) {
    debugger;
    let menus = [];
    let collection = this.state.allAccount;
    console.log(collection);
    if (collection.length > 0) {
      menus.push(<MenuItem value={0} selected={true}>{"Seçin"}</MenuItem>);
      collection.forEach((cmp) => {
        menus.push(
          <MenuItem value={cmp.accountId} id={cmp.addAccNumber} selected={true}>{cmp.addAccName}</MenuItem>);

      })
    }

    return menus;

  }
  handleMultiselectChange = name => event => {
    let accounts = this.state.allAccount;
    accounts.map((tur)=>{
      if(event.target.value==0)
        {
          this.setState({ [name]: event.target.value,hesapBakiyesi:0 });
        }
      if(tur.accountId == event.target.value)
      {
        this.setState({ [name]: event.target.value,hesapBakiyesi:tur.balance,addaccnumber:tur.addAccNumber });
      }
    }) 
  };
  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);
    let userData = global.user;
    let BalanceMenu = this.renderBalanceType("model");

    console.log(userData);
    return (
      <nav className={rootClassName}>
        <div className={classes.logoWrapper}>
          <Link
            className={classes.logoLink}
            to="/"
          >
            <Typography
              className={classes.nameText}
              variant="h2"
            >
              M4A Bank
          </Typography>
          </Link>
        </div>
        <Divider className={classes.logoDivider} />
        <div className={classes.profile}>
          <Link to="/account">
            <Avatar aria-label="recipe" className={classes.avatar}>
              {this.state.userData.nameSurname}
            </Avatar>
          </Link>
          <Typography
            className={classes.nameText}
            variant="h6"
          >
            {this.state.userData.nameSurname}
          </Typography>

         
        </div>
        <Divider className={classes.profileDivider} />
        <List
          component="div"
          disablePadding
        >
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dashboard"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Ana Sayfa"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/account-list"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Profil Bilgileri"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/balance-transfer"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <ImportExportIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Para Transferi"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/record-data"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DriveEtaRoundedIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="HGS İşlemleri"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/account-activities"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Hesap Hareketleri"
            />
          </ListItem>

          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/settings"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Ayarlar"
            />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />

      </nav>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sidebar);

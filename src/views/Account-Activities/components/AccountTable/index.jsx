import React, { Component } from 'react';
import global from '../../../../global';
// Externals
import classNames from 'classnames';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import {
  Paper, AppBar, Toolbar, Typography, Divider, MenuItem, InputLabel, Select, Input, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Fab, InputBase, IconButton, withStyles, Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  Tab,
  Tabs
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
// Shared services
import { getOrders } from 'services/order';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent,
  Status
} from 'components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';

// Component styles
import styles from './styles';
import { SelectAllSharp } from '@material-ui/icons';

function TabPanel(props) {
  let self = this;
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 700,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));
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

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refund: 'danger'
};

class OrdersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.isLoading = false;
    this.state.limit = 20;
    this.state.departmanData = [];
    this.state.calisanData = [];
    this.state.ordersTotal = 0;
    this.state.sendHesapTuru = 0;
    this.state.durum = 0;
    this.state.hesapadi="";
    this.state.bakiye="";
    this.state.valueTab = 0;
    this.state.allAccount=[];
    this.state.hesapturu="";
    this.state.userData = global.user;
    this.openModal2 = this.openModal2.bind(this);
    this.afterOpenModal2 = this.afterOpenModal2.bind(this);
    this.closeModal2 = this.closeModal2.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal1 = this.openModal1.bind(this);
    this.afterOpenModal1 = this.afterOpenModal1.bind(this);
    this.closeModal1 = this.closeModal1.bind(this);
    this.state.hesapBakiyesi = 0;
    this.state.addaccnumber=0;
    this.state.priceValue = '';
    window.updateUserData = this.updateUserData.bind(this);
  }
  signal = false;
  componentWillMount() {
  }
  openModal2() {
    this.setState({ modalIsOpen2: true });
  }

  afterOpenModal2() {
    // references are now sync'd and can be accessed.
  }

  closeModal2() {
    this.setState({ modalIsOpen2: false });
  }
  updateUserData() {
    this.setState({
      userData: global.user
    });
  }

  handleMultiselectChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  handleMultiselectChange1 = name => event => {
    debugger;
    let accounts = this.state.allAccount;
    accounts.map((tur)=>{
      if(event.target.value==0)
        {
          this.setState({ [name]: event.target.value,hesapBakiyesi:0 });
        }
      if(tur.accountId == event.target.value)
      {
        this.setState({ [name]: event.target.value,hesapturu:tur.aType,hesapBakiyesi:tur.balance,addaccnumber:tur.addAccNumber });
      }
    }) 
  };

  async getOrders(limit) {
    try {
      this.setState({ isLoading: true });

      const { priceData, ordersTotal } = await getOrders(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          priceData,
          ordersTotal
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }

  componentDidMount() {
    this.loadData();
    this.loadData1();
    this.signal = true;


  }
  handleChangeHesapAdi(event){
    this.setState({hesapadi:event.target.value});
  }
  handleChangeTutar(event){
    this.setState({bakiye:event.target.value});
  }
  btnhesapEkle() {
    this.openModal2();
  }
  loadData1() {
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
  loadData() {
    
    let self=this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data ={
      CustomerTckn:userId,
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/Account/TransactionData",
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
      debugger;
      self.setState({allAccount:response});
    });
  }
  componentWillUnmount() {
    this.loadData();
    this.signal = false;
  }
  
  handleChangeTab(event, newValue) {
    this.setState({ valueTab: newValue });
  }
  handleMultiselectChange = name => event => {
    let userData = global.user;
    this.setState({ [name]: event.target.value });
  };
  handleChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
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
  handleChange1(event) {
    const onlyNums = event.target.value;
      this.setState({ priceValue: onlyNums });
    
  }
  ParaEkleModal() {
    this.loadData();
    this.openModal();
  }
  ParaCekModal() {
    this.loadData();
    this.openModal1();

  }
  

  render() {
    this.loadData();
    const { classes, className } = this.props;
    const isLoading = this.state.isLoading;
    let BalanceMenu = this.renderBalanceType("model");
    const rootClassName = classNames(classes.root, className);
    const showOrders = !isLoading;

    return (
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            title="Hoşgeldiniz"
          />
          <PortletToolbar>
          <Typography
            className={classes.nameText}
            variant="h6"
          >
          </Typography>
            
          </PortletToolbar>

        </PortletHeader>
        <PerfectScrollbar>
          <PortletContent
            className={classes.portletContent}
            noPadding
          >
            {isLoading && (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            )}

            <Table>

              <TableHead>
                <TableRow>
                <TableCell>Gönderilen Hesap</TableCell>
                <TableCell>Alıcı Hesap</TableCell>
                  <TableCell>İşlem Türü</TableCell>
                  <TableCell>İşlem Açıklaması</TableCell>
                  <TableCell>Tutarı</TableCell>
                  <TableCell>Tarih</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              
                {this.state.allAccount.map((tur) => {

                  return (
                    
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={tur.accountId}
                    >
                      <TableCell>{tur.senderId}</TableCell>
                      <TableCell>{tur.receiverId}</TableCell>
                      <TableCell>{tur.aType}</TableCell>
                      <TableCell>{tur.explanation}</TableCell>
                      <TableCell>{tur.amount}</TableCell>
                      <TableCell>{tur.saveDate}</TableCell>
                    </TableRow>
                    
                  );
                })
                }
              </TableBody>
            </Table>


          </PortletContent>
        </PerfectScrollbar>
      </Portlet>

    );
  }
}

OrdersTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrdersTable);

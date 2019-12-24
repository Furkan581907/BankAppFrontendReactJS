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
      self.setState({allAccount:response});
    });
  }
  componentWillUnmount() {
    this.loadData();
    this.signal = false;
  }
  hesapEkle()
  {
    let self=this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data ={
      CustomerTckn:userId,
      AddAccName:self.state.hesapadi,
      Balance:self.state.bakiye,
      AType:self.state.sendHesapTuru
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/Account/NewAccount",
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
      if(response =="başarılı")
      {
        if(self.state.sendHesapTuru=="Dolar")
        {
          global.user.balance = Number(global.user.balance) + (Number(self.state.bakiye)*Number(5));
        }
        else if(self.state.sendHesapTuru=="Euro")
        {
          global.user.balance = Number(global.user.balance) + (Number(self.state.bakiye)*Number(6));
        }
        else
        global.user.balance = Number(global.user.balance) + Number(self.state.bakiye);
        window.updateUserData();
        Swal.fire('Başarılı',
          'İşlem Başarıyla Gerçekleştirildi',
          'success'
        );
        self.loadData();
      }
      else if(response=="Boşdeğer")
      {
        Swal.fire('Hata',
              'Eksik veya Hatalı değer girdiniz.',
              'error'
            );
      }
      else
      {
        Swal.fire('Hata',
              'İşlem Hatası Oluştu.',
              'error'
            );
      }
    });

  }
  removeAccount(event)
  {
    debugger;
    let accountId = event.currentTarget.id;
    let self=this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data ={
      AccountId:accountId
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/Account/RemoveAccount",
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
      if(response =="başarılı")
      {
        window.updateUserData();
      Swal.fire('Başarılı',
              'Hesap Başarıyla Silindi',
              'success'
            );
        self.loadData();
      }
      else if(response=="paravar")
      {
        Swal.fire('Hata',
              'Hesapta para olduğu için silinemedi.',
              'error'
            );
      }
      else
      {
        Swal.fire('Hata',
              'İşlem Hatası Oluştu.',
              'error'
            );
      }
    });

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
  AddBalance() {
    let self = this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data = {
      CustomerTckn: userId,
      Balance: self.state.priceValue,
      AddAccNumber:self.state.addaccnumber
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/Account/AddMoney",
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
      if (response == "başarılı") {
        if(self.state.hesapturu=="Dolar")
        {
          global.user.balance = Number(global.user.balance) + (Number(self.state.priceValue)*Number(5));
        }
        else if(self.state.hesapturu=="Euro")
        {
          global.user.balance = Number(global.user.balance) + (Number(self.state.priceValue)*Number(6));
        }
        else
        global.user.balance = Number(global.user.balance) + Number(self.state.priceValue);
        window.updateUserData();
        Swal.fire('Başarılı',
          'İşlem Başarıyla Gerçekleştirildi',
          'success'
        );
        let deger = self.state.hesapBakiyesi;
        if(self.state.sendHesapTuru=="Dolar")
        {
          deger = Number(deger) + (Number(self.state.priceValue)*Number(5))
        }
        else if(self.state.sendHesapTuru=="Euro")
        {
          deger = Number(deger) + (Number(self.state.priceValue)*Number(6))
        }
        else
        deger = Number(deger) + Number(self.state.priceValue)
        self.setState({hesapBakiyesi:deger});
        self.loadData1();

      }
      else if(response=="eksipara" || response=="boş")
      {
        Swal.fire('Hata',
          'yanlış veya hatalı tutar girdiniz.',
          'error'
        );
      }
      else {
        Swal.fire('Hata',
          'İşlem Hatası Oluştu.',
          'error'
        );
      }
    });
  }
  RemoveBalance() {
    let self = this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data = {
      CustomerTckn: userId,
      Balance: self.state.priceValue,
      AddAccNumber:self.state.addaccnumber
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/Account/RemoveMoney",
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
      if (response == "başarılı") {
        if(self.state.hesapturu=="Dolar")
        {
          global.user.balance = Number(global.user.balance) - (Number(self.state.priceValue)*Number(5));
        }
        else if(self.state.hesapturu=="Euro")
        {
          global.user.balance = Number(global.user.balance) - (Number(self.state.priceValue)*Number(6));
        }
        else
        global.user.balance = Number(global.user.balance) - Number(self.state.priceValue);
        window.updateUserData();
        Swal.fire('Başarılı',
          'İşlem Başarıyla Gerçekleştirildi',
          'success'
        );
        let deger = self.state.hesapBakiyesi;
        if(self.state.sendHesapTuru=="Dolar")
        {
          deger = Number(deger) - (Number(self.state.priceValue)*Number(5))
        }
        else if(self.state.sendHesapTuru=="Euro")
        {
          deger = Number(deger) - (Number(self.state.priceValue)*Number(6))
        }
        else
        deger = Number(deger) - Number(self.state.priceValue)
        self.setState({hesapBakiyesi:deger});
        self.loadData1();

      }
      else if(response=="yetersiz")
      {
        Swal.fire('Hata',
          'Yetersiz Bakiye',
          'error'
        );
      }
      else if(response=="boş")
      {
        Swal.fire('Hata',
          'Hatalı veya boş değer girdiniz.',
          'error'
        );
      }
      else {
        Swal.fire('Hata',
          'İşlem Hatası Oluştu.',
          'error'
        );
      }
    });
  }

  render() {
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
    Toplam (TL) Bakiyesi : {this.state.userData.balance + " TL"}
          </Typography>
            <Button
              className={classes.newEntryButton}
              color="primary"
              size="small"
              variant="outlined"
              onClick={this.ParaEkleModal.bind(this)}
            >
              Para Yatırma
            </Button>
            <Button
              className={classes.newEntryButton}
              color="primary"
              size="small"
              variant="outlined"
              onClick={this.ParaCekModal.bind(this)}
            >
              Para Çekme
            </Button>
            <Button
              className={classes.newEntryButton}
              color="primary"
              size="small"
              variant="outlined"
              onClick={this.btnhesapEkle.bind(this)}
            >
              Hesap Ekle
            </Button>
            <Modal
              isOpen={this.state.modalIsOpen2}
              onAfterOpen={this.afterOpenModal2}
              onRequestClose={this.closeModal2}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <table cellspacing="10" cellpadding="10">
                <tr>
                  <td><h2>Yeni Hesap Ekle</h2></td>
                </tr>
                <tr>
                  <td>Hesap Türü :</td>
                  <td><Select
                    value={this.state.sendHesapTuru}
                    style={{ width: "250px", fontSize: "15px", paddingLeft: "5px", fontWeight: "bold" }}
                    onChange={this.handleMultiselectChange('sendHesapTuru')}
                    input={<Input id="select-multiple-global" />}
                  >
                    <MenuItem value={0} selected={true}>{"Seçin"}</MenuItem>
                    <MenuItem value={"Vadesiz"} >{"Vadesiz"}</MenuItem>
                    <MenuItem value={"Vadeli"} >{"Vadeli"}</MenuItem>
                    <MenuItem value={"Birikim"} >{"Birikim"}</MenuItem>
                    <MenuItem value={"Euro"} >{"Euro"}</MenuItem>
                    <MenuItem value={"Dolar"} >{"Dolar"}</MenuItem>
                  </Select></td>
                </tr>
                <tr>
                  <td>Hesap Adı :</td>
                  <td><Input type="text" name="hesapadi" onChange={this.handleChangeHesapAdi.bind(this)} /></td>
                </tr>
                <tr>
                  <td>Bakiye Tutarı :</td>
                  <td><Input type="text" name="balance" onChange={this.handleChangeTutar.bind(this)} /></td>
                </tr>
                <tr>
                  <td><Button onClick={this.hesapEkle.bind(this)}>Hesap Ekle</Button></td>
                  <td><Button onClick={this.closeModal2.bind(this)}>Kapat</Button></td>
                </tr>
              </table>
            </Modal>
            <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <table cellspacing="10" cellpadding="10">
              <tr>
                <td><h2>Yatırmak İstediğiniz Tutarı Girin</h2></td>
              </tr>
              <tr>
                <td>Paranın yatırılacağı hesabı seçin :</td>
                <td>
                  <Select
                    value={this.state.sendHesapTuru}
                    style={{ width: "250px", fontSize: "15px", paddingLeft: "5px", fontWeight: "bold" }}
                    onChange={this.handleMultiselectChange1('sendHesapTuru')}
                    input={<Input id="select-multiple-global" />}
                  >
                    {BalanceMenu}

                  </Select>
                </td>
              </tr>
              <tr>                 
                 <td>Mevcut Bakiye : {this.state.hesapBakiyesi}</td>
              </tr>
              <tr>
                <td>Bakiye Tutarı(TL) :</td>
                <td><Input type="text" name="balance" onChange={this.handleChange1.bind(this)} /></td>
              </tr>
              <tr>
                <td><Button onClick={this.AddBalance.bind(this)}>Hesabıma Ekle</Button></td>
                <td><Button onClick={this.closeModal.bind(this)}>Kapat</Button></td>
              </tr>
            </table>

          </Modal>
          <Modal
            isOpen={this.state.modalIsOpen1}
            onAfterOpen={this.afterOpenModal1}
            onRequestClose={this.closeModal1}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <table cellspacing="10" cellpadding="10">
              <tr>
                <td><h2>Çekmek İstediğiniz Tutarı Girin</h2></td>
                <td>
                  <Select
                    value={this.state.sendHesapTuru}
                    style={{ width: "250px", fontSize: "15px", paddingLeft: "5px", fontWeight: "bold" }}
                    onChange={this.handleMultiselectChange1('sendHesapTuru')}
                    input={<Input id="select-multiple-global" />}
                  >
                    {BalanceMenu}

                  </Select>
                </td>
              </tr>
              <tr>                 
                 <td>Mevcut Bakiye : {this.state.hesapBakiyesi}</td>
              </tr>
              <tr>
                <td>Bakiye Tutarı(TL) :</td>
                <td><Input type="text" name="balance" onChange={this.handleChange1.bind(this)} /></td>
              </tr>
              <tr>
                <td><Button onClick={this.RemoveBalance.bind(this)}>Para Çek</Button></td>
                <td><Button onClick={this.closeModal1.bind(this)}>Kapat</Button></td>
              </tr>
            </table>

          </Modal>
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
                  <TableCell>Hesap No</TableCell>
                  <TableCell>Ek Hesap No</TableCell>
                  <TableCell>Hesap Türü</TableCell>
                  <TableCell>Hesap Adı</TableCell>
                  <TableCell>Bakiye</TableCell>
                  <TableCell>Hesap Sil</TableCell>
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
                      <TableCell>{tur.accountNumber}</TableCell>
                      <TableCell>{tur.addAccNumber}</TableCell>
                      <TableCell>{tur.aType}</TableCell>
                      <TableCell>{tur.addAccName}</TableCell>
                      <TableCell>{tur.balance}</TableCell>
                      <TableCell><Button id={tur.accountId} onClick={this.removeAccount.bind(this)}>Sil</Button></TableCell>
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

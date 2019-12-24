import React, { Component } from 'react';
import global from '../../../../global';
// Externals
import classNames from 'classnames';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {
  Paper, AppBar, Toolbar, Typography, Divider, MenuItem, InputLabel, Select, Input, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Fab, InputBase, IconButton,withStyles,Button,
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

// Component styles
import styles from './styles';

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
 
const statusColors = {
  delivered: 'success',
  pending: 'info',
  refund: 'danger'
};

class OrdersTable extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.state.isLoading=false;
    this.state.limit=20;
    this.state.AccountData=[];
    this.state.sendBalanceType=-1;
    this.state.sendBalance=0;
    this.state.avaibleBalance=0;
    this.state.AccountType = [];
    this.state.sendhesapno="";
    this.state.sayfadurum="Virman";
    this.state.gonderilenHesapId=0;
    this.state.allAccount = [];
    this.state.hesapBakiyesi = 0;
    this.state.addaccnumber=0;
    this.state.hesapturugonderen="";
    this.state.hesapturualici="";
    this.state.sendHesapTuru=0;
    this.state.sendHesapTuruGiden=0;
    this.state.hesapBakiyesiMevcut=0;
    this.state.gonderilenVirmanTutari=0;
    this.state.gonderilenhesapno="";
    this.state.havaleaciklama="";
  }
  signal = false;
  
  componentWillMount() {
  }
  

  async getOrders(limit) {
    try {
      this.setState({ isLoading: true });

      const { AccountData, ordersTotal } = await getOrders(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          AccountData,
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
    this.signal = true;


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

handleChangeTab(event, newValue) {
  this.setState({valueTab:newValue});
}
handleChange(event) {
  this.setState({gonderilenVirmanTutari: event.target.value});
}
handleChangeAciklama(event) {
  this.setState({havaleaciklama: event.target.value});
}
handleMultiselectChange1 = name => event => {
  debugger;
  let accounts = this.state.allAccount;
  accounts.map((tur)=>{
    if(event.target.value==0)
      {
        this.setState({ [name]: event.target.value,hesapBakiyesi:0 });
      }
    if(tur.addAccNumber == event.target.value)
    {
      this.setState({ [name]: event.target.value,hesapturugonderen:tur.aType,hesapBakiyesi:tur.balance,addaccnumber:tur.addAccNumber });
    }
  }) 
};
handleMultiselectChange = name => event => {
  debugger;
  let accounts = this.state.allAccount;
  accounts.map((tur)=>{
    if(event.target.value==0)
      {
        this.setState({ [name]: event.target.value,hesapBakiyesi:0 });
      }
    if(tur.addAccNumber == event.target.value)
    {
      this.setState({ [name]: event.target.value,hesapturualici:tur.aType,hesapBakiyesiMevcut:tur.balance,addaccnumber:tur.addAccNumber });
    }
  }) 
};
sendUserName(event) {
  this.setState({sendUserName: event.target.value});
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
        <MenuItem value={cmp.addAccNumber} id={cmp.addAccNumber} selected={true}>{cmp.addAccName}</MenuItem>);

    })
  }

  return menus;

}
onChangeButtonVirman()
{
  this.setState({sayfadurum:"Virman"});
}
onChangeButtonHavale()
{
  this.setState({sayfadurum:"Havale"});
}
Virman()
{
  let self = this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data = {
      CustomerId: userId,
      Money: self.state.gonderilenVirmanTutari,
      AvaibleAccNumber:self.state.sendHesapTuru,
      SentAccNumber:self.state.sendHesapTuruGiden
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/MoneyTransfer/Virman",
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
      if (response == "Başarılı") {
        debugger;
        if(self.state.hesapturugonderen=="Dolar" && (self.state.hesapturualici == "TL" || self.state.hesapturualici == "Vadeli" || self.state.hesapturualici == "Vadesiz" || self.state.hesapturu == "Birikim"))
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 = Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari)*Number(5));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});
                            }
                            else if(self.state.hesapturugonderen=="Euro" && (self.state.hesapturualici=="TL" || self.state.hesapturualici=="Vadeli" || self.state.hesapturualici=="Vadesiz" || self.state.hesapturu=="Birikim"))
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 = Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari)*Number(6));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});

                            }
                            else if(self.state.hesapturugonderen=="Dolar" && self.state.hesapturualici=="Euro")
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 = Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari)*Number(5/6));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});

                            }
                            else if (self.state.hesapturugonderen == "Euro" && self.state.hesapturualici == "Dolar")
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 = Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari)*Number(6/5));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});

                            }
                            else if (self.state.hesapturualici == "Euro" && (self.state.hesapturugonderen == "TL" || self.state.hesapturugonderen == "Vadeli" || self.state.hesapturugonderen == "Vadesiz" || self.state.hesapturugonderen == "Birikim"))
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 = Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari)/Number(6));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});

                            }
                            else if (self.state.hesapturualici == "Dolar" && (self.state.hesapturugonderen == "TL" || self.state.hesapturugonderen == "Vadeli" || self.state.hesapturugonderen == "Vadesiz" || self.state.hesapturugonderen == "Birikim"))
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 = Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari)/Number(5));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});

                            }
                            else
                            {
                                let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
                                let values1 =  Number(self.state.hesapBakiyesiMevcut) + (Number(self.state.gonderilenVirmanTutari));
                                self.setState({hesapBakiyesi:values,hesapBakiyesiMevcut:values1});

                            }
                window.updateUserData();
        Swal.fire('Başarılı',
          'İşlem Başarıyla Gerçekleştirildi',
          'success'
        );
      }
      else if(response=="eksipara" || response=="boş")
      {
        Swal.fire('Hata',
          'yanlış veya hatalı tutar girdiniz.',
          'error'
        );
      }
      else if(response=="Aynı Hesap")
      {
        Swal.fire('Hata',
          'Aynı Hesaplarda işlem yapamazsınız.',
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

Havale()
{
  let self = this;
    let userData = global.user;
    let userId = userData.customerTckn;

    let data = {
      GonderenId: userId,
      Tutar: self.state.gonderilenVirmanTutari,
      AliciId:self.state.gonderilenhesapno,
      GonderenHesap:self.state.sendHesapTuru,
      Aciklama:self.state.havaleaciklama
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:58877/api/MoneyTransfer/Havale",
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
      if (response == "Başarılı") {
        let values = Number(self.state.hesapBakiyesi) -(Number(self.state.gonderilenVirmanTutari));
        self.setState({hesapBakiyesi:values});
                window.updateUserData();
        Swal.fire('Başarılı',
          'İşlem Başarıyla Gerçekleştirildi',
          'success'
        );
      }
      else if(response=="eksipara" || response=="boş" || response=="yetersiz")
      {
        Swal.fire('Hata',
          'yanlış veya hatalı tutar girdiniz.',
          'error'
        );
      }
      else if(response=="musterinohatasi"){
        Swal.fire('Hata',
          'Hatalı Müşteri Numarası Girdiniz.',
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
sendhesapno1(event)
{
  let cevir = event.target.value.replace(/[^0-9]/g, "").slice(0,11);
  this.setState({gonderilenhesapno:cevir});
}
  render() {
    const { classes, className } = this.props;
    const isLoading = this.state.isLoading;
    const AccountData = this.state.AccountData;
    const ordersTotal = this.state.ordersTotal;
    let BalanceMenu = this.renderBalanceType("model");
    const rootClassName = classNames(classes.root, className);
    const showOrders = !isLoading;

    return (
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            title="Para Transferi"
          />
          
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
            <Button onClick={this.onChangeButtonVirman.bind(this)}>Virman</Button>
            <Button onClick={this.onChangeButtonHavale.bind(this)}>Havale</Button>
            {this.state.sayfadurum=="Havale" && (
              <table cellSpacing="10" cellPadding="10">
                <tr>
                  <td>Göndereceğiniz Hesap : </td>
                  <td><Select
                        value={this.state.sendHesapTuru}
                        style={{ width: "250px", fontSize: "15px", paddingLeft: "5px", fontWeight: "bold" }}
                        onChange={this.handleMultiselectChange1('sendHesapTuru')}
                        input={<Input id="select-multiple-global" />}
                    >
                        {BalanceMenu}
                    </Select></td>
                    <td>Kullanabileceğiniz Bakiye : {this.state.hesapBakiyesi}</td>
                  </tr>
                <tr>
                  <td>Göndereceğiniz Kişinin Hesap Numarası: </td>
                  <td><Input type="text" name="balance" onChange={this.sendhesapno1.bind(this)} value={this.state.gonderilenhesapno}/></td>
                  </tr>
                  
                  <tr>
                  <td>Göndereceğiniz Tutar : </td>
                  <td><Input type="text" name="balance" onChange={this.handleChange.bind(this)}/></td>
                  </tr>
                  <tr>
                  <td>Açıklama : </td>
                  <td><Input type="text" name="balance" onChange={this.handleChangeAciklama.bind(this)}/></td>
                  </tr>
                  <tr>
                  <td><Button onClick={this.Havale.bind(this)}>Transferi Yap</Button></td>
                  </tr>
                </table>
            )}
            {this.state.sayfadurum=="Virman" && (
              <table cellSpacing="10" cellPadding="10">
                <tr>
                  <td>Göndereceğiniz Hesap : </td>
                  <td><Select
                        value={this.state.sendHesapTuru}
                        style={{ width: "250px", fontSize: "15px", paddingLeft: "5px", fontWeight: "bold" }}
                        onChange={this.handleMultiselectChange1('sendHesapTuru')}
                        input={<Input id="select-multiple-global" />}
                    >
                        {BalanceMenu}
                    </Select></td>
                    <td>Kullanabileceğiniz Bakiye : {this.state.hesapBakiyesi}</td>
                  </tr>
                <tr>
                  <td>Alıcı Hesabım: </td>
                  <td><Select
                        value={this.state.sendHesapTuruGiden}
                        style={{ width: "250px", fontSize: "15px", paddingLeft: "5px", fontWeight: "bold" }}
                        onChange={this.handleMultiselectChange('sendHesapTuruGiden')}
                        input={<Input id="select-multiple-global" />}
                    >
                        {BalanceMenu}
                    </Select></td>
                    <td>Mevcut Bakiye : {this.state.hesapBakiyesiMevcut}</td>
                  </tr>
                  
                  <tr>
                  <td>Göndereceğiniz Tutar : </td>
                  <td><Input type="text" name="balance" onChange={this.handleChange.bind(this)}/></td>
                  </tr>
                  
                  <tr>
                  <td><Button onClick={this.Virman.bind(this)}>Transferi Yap</Button></td>
                  </tr>
                </table>
            )}
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

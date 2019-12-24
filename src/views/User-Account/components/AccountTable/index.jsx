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
    this.state.telefon ="";
    this.state.adisoyadi="";
    this.state.tckimlik="";
    this.state.sifre="";
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal1 = this.openModal1.bind(this);
    this.afterOpenModal1 = this.afterOpenModal1.bind(this);
    this.closeModal1 = this.closeModal1.bind(this);
    this.state.eskisifre="";
    this.state.yenisifre="";
    this.state.yenisifretekrar="";
    this.state.yenitelefon="";
    this.state.yeniTelefon="";
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
  loadData(){
    let userData = global.user;
    let customerTckn = userData.customerTckn;
    let adisoyadi = userData.nameSurname;
    let telefon = userData.phoneNumber;
    let sifre = userData.password
    this.setState({tckimlik:customerTckn,adisoyadi:adisoyadi,telefon:telefon,sifre:sifre});
  }
  btnTelefonDegis()
  {
    let self = this;
    let userData = global.user;
    let customerTckn = userData.customerTckn;
    let yenisifre = this.state.yenisifre;
    let yenitelefon = this.state.yeniTelefon;
      let data ={
        CustomerTckn:customerTckn,
        PhoneNumber:yenitelefon,
        Password:yenisifre
      };
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:58877/api/Customer/setphone",
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
        if(response=="başarılı")
        {
          Swal.fire('Başarılı',
            'İşlem Başarıyla Gerçekleştirildi Lütfen Yeniden Giriş Yapın',
            'success'
          );
          self.setState({telefon:yenitelefon});
        }
        else if(response=="Hatalı")
        {
          Swal.fire('Hata',
            'Geçersiz',
            'error'
          );
        }
        else
        {
          Swal.fire('Hata',
            'İşlem Hatası',
            'error'
          );
        }
      });
    }
  btnSifreDegis()
  {
    let userData = global.user;
    let customerTckn = userData.customerTckn;
    let eskisifre = this.state.eskisifre;
    let yenisifre = this.state.yenisifre;
    let yenisifretekrar = this.state.yenisifretekrar;
    if(yenisifre==yenisifretekrar)
    {
      let data ={
        CustomerTckn:customerTckn,
        OldPassword:eskisifre,
        Password:yenisifre
      };
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:58877/api/Customer/setpassword",
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
        if(response=="başarılı")
        {
          Swal.fire('Başarılı',
            'İşlem Başarıyla Gerçekleştirildi',
            'success'
          );
          
        }
        else if(response=="Hatalı")
        {
          Swal.fire('Hata',
            'Geçersiz',
            'error'
          );
        }
        else
        {
          Swal.fire('Hata',
            'İşlem Hatası',
            'error'
          );
        }
      });
    }
    else
    {
      Swal.fire('Hata',
          'Şifreler Aynı Değil',
          'error'
        );
    }
  }

  componentWillUnmount() {
    this.loadData();
    this.signal = false;
  }

handleChangeTab(event, newValue) {
  this.setState({valueTab:newValue});
}
handleChangeEski(event)
{
  this.setState({eskisifre:event.target.value});

}
handleChangeYeni(event)
{
  this.setState({yenisifre:event.target.value});

}
handleChangeYeniTekrar(event)
{
  this.setState({yenisifretekrar:event.target.value});

}
handleChangeTelefon(event)
{
  let cevir = event.target.value.replace(/[^0-9]/g, "").slice(0,10);
  this.setState({yeniTelefon:cevir});
}
handleChangeSifre(event)
{
  this.setState({yenisifre:event.target.value});
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
sifreDegis()
{
 this.openModal();
}
telefonDegis()
{
this.openModal1();
}
  render() {
    const { classes, className } = this.props;
    const isLoading = this.state.isLoading;
    const AccountData = this.state.AccountData;
    const ordersTotal = this.state.ordersTotal;
    

    const rootClassName = classNames(classes.root, className);
    const showOrders = !isLoading;

    return (
      
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            title="TRY Döviz Kurları"
          />
          <PortletToolbar>
            
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
            <table>
              <tr>
                <td>Tc Kimlik Numaranız : {this.state.tckimlik}</td>
              </tr>
              <tr>
                <td>Ad Soyad : {this.state.adisoyadi}</td>
              </tr>
              <tr>
                <td>Telefon : {this.state.telefon}</td>
              </tr>
              <tr>
                <td><Button onClick={this.sifreDegis.bind(this)}>Şifremi Değiştir</Button></td>
                <td><Button onClick={this.telefonDegis.bind(this)}>Telefon Numaramı Değiştir</Button></td>

              </tr>

            </table>
            <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <table cellspacing="10" cellpadding="10">
              <tr>
                <td><h2>Eski Şifrenizi Girin</h2></td>
                <td><Input type="password" name="balance" onChange={this.handleChangeEski.bind(this)} /></td>
              </tr>
              <tr>
                <td><h2>Yeni Şifrenizi Girin</h2></td>
                <td><Input type="password" name="balance" onChange={this.handleChangeYeni.bind(this)} /></td>
              </tr>
              <tr>
                <td><h2>Yeni Şifrenizi Tekrar Girin</h2></td>
                <td><Input type="password" name="balance" onChange={this.handleChangeYeniTekrar.bind(this)} /></td>
              </tr>
              
              <tr>
              <td><Button onClick={this.btnSifreDegis.bind(this)}>Güncelle</Button></td>
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
                <td><h2> Yeni Telefon Numaranızı Girin</h2></td>
                <td><Input type="text" name="balance" onChange={this.handleChangeTelefon.bind(this)} value={this.state.yeniTelefon}/></td>
              </tr>
              <tr>
                <td><h2>Şifrenizi Girin</h2></td>
                <td><Input type="password" name="balance" onChange={this.handleChangeSifre.bind(this)} /></td>
              </tr>
              
              <tr>
              <td><Button onClick={this.btnTelefonDegis.bind(this)}>Güncelle</Button></td>
                <td><Button onClick={this.closeModal1.bind(this)}>Kapat</Button></td>
              </tr>
            </table>

          </Modal>
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

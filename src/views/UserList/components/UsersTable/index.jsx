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
;
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
    debugger;
    let self=this;
    let userData = global.user;
    let userId;
    userData.map((item, key) =>
    userId=item.id)
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:32771/api/BuySell/accountdata",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "http://localhost:32771",
        "Cache-Control": "no-cache",
        "Host": "localhost:32771",
        "Accept-Encoding": "gzip, deflate",
        "Content-Length": "104",
        "Connection": "keep-alive",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": userId
    }
    
    $.ajax(settings).done(function (response) {
      self.setState({AccountData:response});
    });
  }

  componentWillUnmount() {
    this.loadData();
    this.signal = false;
  }

handleChangeTab(event, newValue) {
  this.setState({valueTab:newValue});
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
            <Button
              className={classes.newEntryButton}
              color="primary"
              size="small"
              variant="outlined"
              onClick={this.dataSave}
            >
              Verileri Kaydet
            </Button>
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
            {showOrders && (
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>Tipi</TableCell>
                  <TableCell>İşlem Gören Tür</TableCell>
                    <TableCell align="left">İşlem Sonuç Türü</TableCell>
                    <TableCell
                      align="left"
                      sortDirection="desc"
                    >
                      <Tooltip
                        enterDelay={300}
                        title="Sort"
                      >
                        <TableSortLabel
                          active
                          direction="desc"
                        >
                          Kur Değeri
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">Alınan Tutar</TableCell>
                    <TableCell align="left">Kur Karşılığı</TableCell>
                    <TableCell align="left">Alım Tarihi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.AccountData.map((tur)=>{
                    return (
                    <TableRow
                    className={classes.tableRow}
                    hover
                    key={tur.Id+1}
                    data-item={tur.forexBuying && tur.forexSelling}
                    onClick={this.onClickHandler}
                  >
                    <TableCell>{tur.saveDate}</TableCell>
                    <TableCell>{tur.currencyCode}</TableCell>
                    <TableCell>{tur.unit}</TableCell>
                    <TableCell>{tur.currency}</TableCell>
                    <TableCell data-title={tur.forexBuying}>{tur.forexBuying}</TableCell>
                    <TableCell data-title={tur.forexSelling}>{tur.forexSelling}</TableCell>
                    <TableCell>{tur.banknoteBuying}</TableCell>
                    </TableRow>
                  ); })
                  }
                </TableBody>
              </Table>
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



import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Stack,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { GridList2 } from "../../../sections/components/grid-lists/grid-list-2";
import { paths } from "../../../paths";
import axios from "axios";
import OrderForm from "./Orderform";
import BuyForm from "./buyform";
import UpdateForm from "./updateForm";
import { useSnackbar } from 'notistack';

const CryptoMarketplacePage = () => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("Listed");
  const [openForm, setOpenForm] = useState(false);
  const [buyForm, setBuyForm] = useState(false);
  const [updateForm,setUpdateForm]=useState(false);
  const [currentdata , setCurrentData] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchData();
  }, [status]);

  const fetchData = async () => {
    try {
      const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };

      let url;
      if (status === "Listed") {
        url = `${BASEURL}/api/Order/getAllOrderForAll`;
      } else if (status === "Ordered") {
        url = `${BASEURL}/api/Order/getAllOrderForOneUSer`;
      }

      const response = await axios.get(url, { headers });
      const data = response.data;
      console.log(data);
      setListings(data.order);
    } catch (error) {
      enqueueSnackbar("Error fetching data", { variant: "error" });
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleCreateOrder = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleCloseBuyForm = () => {
    setBuyForm(false);
  };

  const handleCloseUpdateForm = () => {
    setUpdateForm(false);
  };

  const handlePlaceOrder = async (formData) => {
    try {
      const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };

      const response = await axios.post(`${BASEURL}/api/Order/createOrder`, formData, { headers });
      const responseData = response.data;

      enqueueSnackbar("Order placed successfully", { variant: "success" });
      handleCloseForm();
    } catch (error) {
      enqueueSnackbar("Error placing order", { variant: "error" });
      console.error("Error placing order:", error);
    }
  };

  const handleBuyOrder = async (rowdata) => {
    try {
      const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };
      const data = {
        sellerId: rowdata.userId,
        coin: rowdata.coin,
        amount: rowdata.amount,
      };

      const response = await axios.post(`${BASEURL}/api/Order/createBuyOrder/${rowdata._id}`, data, { headers });
      const responseData = response.data;

      enqueueSnackbar("Order placed successfully", { variant: "success" });
      handleCloseBuyForm();
    } catch (error) {
      console.error("Error placing order:", error.response.data);
      enqueueSnackbar(error.response.data.error, {
        variant: 'error',
      });
    }
  };

  const handleUpdateOrder = async (rowdata) => {
    try {
      const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };

      const data = {
        orderId: rowdata._id, 
        userId: rowdata.userId, 
        coin: rowdata.coin,
        amount: rowdata.amount,
        exchange_currency: rowdata.exchange_currency,
        payment_method: rowdata.payment_method,
      };

      const response = await axios.post(`${BASEURL}/api/Order/updateOrder`, data, { headers });
      const responseData = response.data;

      enqueueSnackbar("Order updated successfully", { variant: "success" });
      handleCloseUpdateForm();
    } catch (error) {
      console.error("Error updating order:", error.response.data);
      enqueueSnackbar(error.response.data.error, { variant: "error" });
    }
  };

  const handleDeleteOrder = async (rowdata) => {
    try {
      const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.delete(`${BASEURL}/api/Order/deleteOrder`, {
        headers,
        data: { orderId: rowdata._id, userId: rowdata.userId },
      });
    
  
      const responseData = response.data;
      console.log(`DELETE order with data: ${JSON.stringify(rowdata)}`);
      console.log(`DELETE order response: ${JSON.stringify(responseData)}`);
  
      enqueueSnackbar("Order deleted successfully", { variant: "success" });
  
      // After successful deletion, fetch updated data
      fetchData();
    } catch (error) {
      console.error("Error deleting order:", error.response.data);
      enqueueSnackbar(error.response.data.error, { variant: "error" });
    }
  };
  

  const handleBuyButtonClick = (data) => {
    setCurrentData(data);
    setBuyForm(true);
  };

  const handleUpdateButtonClick = (data) => {
    setCurrentData(data);
    setUpdateForm(true);
  };

  const handleDeleteButtonClick = (data) => {
    const { _id: orderId, userId } = data;
    handleDeleteOrder(orderId, userId);
  };

  return (
    <>
      <Head>
        <title>Crypto Marketplace | Your Crypto Hub</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Typography variant="h3">Crypto Marketplace</Typography>
            <Breadcrumbs separator="›">
            <Link href={paths.dashboard.index} passHref style={{ textDecoration: "none" }}>
                <Typography color="text.primary" style={{ cursor: "pointer", textDecoration: "none" }}>
                  Dashboard
                </Typography>
              </Link>
              <Typography color="text.primary">Crypto Marketplace</Typography>
            </Breadcrumbs>
          </Stack>
          <Typography variant="h4" sx={{ mt: 4 }}>
            Featured Listings
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Select
              value={status}
              onChange={handleStatusChange}
              displayEmpty
              fullWidth
              sx={{ mr: 1, width: "50%" }}
              renderValue={(selected) => (
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selected === "Listed" ? "Listed" : "Ordered"}
                </Typography>
              )}
            >
              <MenuItem value="Listed">
                <Typography variant="body1">Listed</Typography>
              </MenuItem>
              <MenuItem value="Ordered">
                <Typography variant="body1">Ordered</Typography>
              </MenuItem>
            </Select>
            <Button variant="contained" size="medium" onClick={handleCreateOrder}>
              Create Order
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <GridList2
            projects={listings}
            handleBuyButtonClick={handleBuyButtonClick}
            handleUpdateButtonClick={handleUpdateButtonClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
            status={status}
          />
        </Container>
      </Box>
      <OrderForm open={openForm} handleClose={handleCloseForm} handlePlaceOrder={handlePlaceOrder} />
      <BuyForm currentdata={currentdata} open={buyForm} handleCloseBuyForm={handleCloseBuyForm} handleBuyOrder={handleBuyOrder} />
      <UpdateForm currentdata={currentdata} open={updateForm} handleCloseUpdateForm={handleCloseUpdateForm} handleUpdateOrder={(rowData, userId) => handleUpdateOrder(rowData, userId)} />
    </>
  );
};

CryptoMarketplacePage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CryptoMarketplacePage;


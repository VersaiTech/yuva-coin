import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import Head from "next/head";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
  Card,
  Grid,
  CardHeader,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { paths } from "../../../paths";
import { CustomerEditForm } from "../../../sections/dashboard/stake/stake-add-form";
import { CustomerWithdrawForm } from "../../../sections/dashboard/stake/stake-withdraw-form";
import InterestCalculator from "./calculator";
import { padding } from "@mui/system";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useTotalInvestment = () => {
  const [totalInvestment, setTotalInvestment] = useState(null);

  const getTotalInvestment = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // If token is not available, redirect to login page
        window.location.href = "/auth/login/modern"; // Assuming login page route is "/login"
        return;
      }
      const headers = {
        Authorization: token,
      };

      const response = await axios.get(
        `${BASEURL}/api/Staking/getTotalInvestmentByUserId`,
        {
          headers: headers,
        }
      );
      console.log(response.data);

      setTotalInvestment(response.data.totalInvestment);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getTotalInvestment();
  }, []);

  return totalInvestment;
};

const Page = () => {
  const totalInvestment = useTotalInvestment();

  usePageView();

  return (
    <>
      <Head>
        <title>Dashboard: Stake Add | YuvaBitcoin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // py: 4,
          pl: 0,
          // padding: "0px",
        }}
      >
        <Container
          maxWidth="lg"
          //want to padding 0
          sx={ { pl: 0 }}
        >
          <Stack spacing={4 }sx={ { pl: 0 }}>
            <Stack spacing={4} sx={ { pl: 0 }}>
              <div>
                <Link
                  color="text.primary"
                  href={paths.dashboard.stake.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Stakes</Typography>
                </Link>
              </div>
              <Grid
                container
                //want to spacing top and bottom
              >
                <Grid item xs={12} md={6}>
                  <Container
                    maxWidth="sm"
                    sx={{ textAlign: "center", padding: 0 }}
                  >
                    <Card sx={{ padding: 0 , }}>
                      {" "}
                      {/* Remove all padding from the Card */}
                      <CardHeader
                        subheader={
                          <Typography variant="h4" color="green">
                            {"₿ " + totalInvestment || 0}
                          </Typography>
                        }
                        sx={{ pb: 0 }}
                        title={
                          <Typography color="text.secondary" variant="overline">
                            Total Stake balance
                          </Typography>
                        }
                      />
                      <CardContent sx={{ padding: 0 , }}>
                        {" "}
                        {/* Remove all padding from the CardContent */}
                        <Divider sx={{ mb: 2 }} />
                        <Typography color="text.secondary" variant="overline">
                          Available currency
                        </Typography>
                        <Divider />
                        <Stack
                          alignItems="flex-start"
                          spacing={1}
                          sx={{ mt: 2 }}
                          display={"flex"}
                          direction={"row"}
                          justifyContent={"space-around"}
                        >
                          <Link href={paths.dashboard.deposits.index}>
                            <Button color="primary" variant="contained">
                              Add money to wallet
                            </Button>
                          </Link>
                          <Link href={paths.dashboard.withdraw.create}>
                            <Button
                              //want to color orange
                              sx={{
                                backgroundColor: "orange",
                              }}
                              variant="contained"
                            >
                              Withdraw funds
                            </Button>
                          </Link>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Container>
                </Grid>

                <Grid item xs={12} md={6}>
                  <InterestCalculator />
                </Grid>
              </Grid>
            </Stack>
            <CustomerEditForm /> {/* handleSubmit={handleSubmit} */}
            <CustomerWithdrawForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Download01Icon from "@untitled-ui/icons-react/build/esm/Download01";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { customersApi } from "../../../api/customers";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { CustomerListSearch } from "../../../sections/dashboard/customer/customer-list-search";
import { CustomerListTable } from "../../../sections/dashboard/customer/customer-list-table";
import { WithdrawalListSearch } from "../../../sections/dashboard/withdrawals/withdrawals-list-search";
import { WithdrawalsListTable } from "../../../sections/dashboard/withdrawals/withdrawals-list-table";
import { DepositListSearch } from "../../../sections/dashboard/deposit/deposit-list-search";
import { DepositListTable } from "../../../sections/dashboard/deposit/deposit-list-table";
import axios from "axios";
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      hasAcceptedMarketing: undefined,
      isProspect: undefined,
      isReturning: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: "updatedAt",
    sortDir: "desc",
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useCustomers = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    customers: [],
    customersCount: 0,
  });

  const { page, rowsPerPage } = search;
  const getCustomers = useCallback(async () => {
    try {
      // const response = await customersApi.getCustomers(search);
      const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: token,
      };

      const response = await axios.get(`${BASEURL}/api/Deposit/getAllDepositsForAdmin/${page + 1}/${rowsPerPage}`,
      {headers: headers});

      
      const TodayUsersResponse = await axios.get(
        `${BASEURL}/admin/usdtDepositToday/${page + 1}/${rowsPerPage}`,
        { headers: headers }
      );


      // const blockedUsersResponse = await axios.get(
      //   `${BASEURL}/admin/getBlockedMembers`,
      //   { headers: headers }
      // );

      if (isMounted()) {
        setState({
          customers: response.data.allDeposits || [],
          customersCount: response.data.allDepositsTotal,
          TodayUsersResponse: TodayUsersResponse.data.data || [],
          // blockedUsers: blockedUsersResponse.data.members,
        });
      }
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isMounted]);

  useEffect(
    () => {
      getCustomers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  return state;
};

const Page = () => {
  const { search, updateSearch } = useSearch();
  const [allDeposits,setAllDeposits] = useState(null);
  const { customers, customersCount, TodayUsersResponse } =
    useCustomers(search);

 

  const [currentTab, setCurrentTab] = useState("all");
  const [searchResults, setSearchResults] = useState([]);

 

  usePageView();

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
      }));
    },
    [updateSearch]
  );

  const handleSortChange = useCallback(
    (sort) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
      }));
    },
    [updateSearch]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch]
  );

  useEffect(() => {}, [currentTab]);

  const handleRowsPerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch]
  );

  const getAllDeposits = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: token,
      };

      const response = await axios.get(`${BASEURL}/api/Deposit/getAllDepositsForAdmin/1/100000`, {
        headers: headers,
      });
      console.log("All Deposits are ",response.data.allDeposits)

      setAllDeposits(response.data.allDeposits);
    } catch (err) {
      console.error("Error fetching all customers: ", err);
    }
  };
  useEffect(() => {
    getAllDeposits();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard: Deposit List | Yuva Bitcoin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">All Deposit</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  {/* <Button
                    color="inherit"
                    size="small"
                    startIcon={(
                      <SvgIcon>
                        <Upload01Icon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={(
                      <SvgIcon>
                        <Download01Icon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button> */}
                </Stack>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                {/* <Button
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button> */}
              </Stack>
            </Stack>
            <Card>
              <DepositListSearch
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
                // activeUsers={activeUsers}
                todayUsers={TodayUsersResponse}
                // blockedUsers={blockedUsers}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                setSearchResults={setSearchResults}
                allDeposits={allDeposits}
                
              />
              <DepositListTable
                // customers={customers}
                // customersCount={customersCount}
                customers={
                  searchResults.length > 0 ? searchResults :
                  currentTab === "all"
                    ? customers
                    : currentTab === "hasAcceptedMarketing"
                    ? TodayUsersResponse
                    
                    : customers
                }
                customersCount={
                  searchResults.length > 0 ? searchResults.length :
                  currentTab === "all"
                    ? customersCount
                    : currentTab === "hasAcceptedMarketing"
                    ? TodayUsersResponse
                    
                    : customersCount
                }
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={search.rowsPerPage}
                page={search.page}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

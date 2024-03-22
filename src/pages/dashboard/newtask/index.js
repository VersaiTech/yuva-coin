import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import Download01Icon from "@untitled-ui/icons-react/build/esm/Download01";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import { paths } from "../../../paths";
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
import { NewtaskListSearch } from "../../../sections/dashboard/newtask/newtask-list-search";
import { NewtaskListTable } from "../../../sections/dashboard/newtask/newtask-list-table";
import axios from "axios";
import { customer, customers } from "../../../api/customers/data";
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
  console.log(search);

  const getCustomers = useCallback(async () => {
    try {
      // const response = await customersApi.getCustomers(search);
      const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: token,
      };

      const response = await axios.get(
        `${BASEURL}/admin/getAllTasks/${page + 1}/${rowsPerPage}`,
        { headers: headers }
      );

      console.log(response.data);

      // console.log(setState(response.data));

      if (isMounted()) {
        setState({
          customers: response.data.tasks,
          customersCount: 10,
        });
      }
      console.log(customers.data.tasks);
    } catch (err) {
      // console.error(err.response.datax);
    }
  }, [search, isMounted]);

  useEffect(() => {
    getCustomers();
  }, [search]);

  return state;
};

const Page = () => {
  // get url status from query
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");

  const { search, updateSearch } = useSearch();

  const { customers, customersCount, completed, rejected, pending } =
    useCustomers(search);

  const [currentTab, setCurrentTab] = useState("all");

  usePageView();

  // const handlePageChange = useCallback(
  //   (event, pageData) => {
  //     console.log(pageData);
  //   },
  //   [updateSearch]
  // );

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
      console.log(page);
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      console.log(event.target.value);
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch]
  );

  return (
    <>
      <Head>
        <title>Dashboard: Task List | Yuva Bitcoin</title>
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
                <Typography variant="h4">All Task</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  component={NextLink}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  href={paths.dashboard.newtask.create}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    "&:hover::after": {
                      content: '""',
                      position: "absolute",
                      zIndex: 1,
                      top: "50%",
                      left: "50%",
                      width: "300%",
                      height: "300%",
                      background: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "50%",
                      transition: "all 0.6s ease",
                      transform: "translate(-50%, -50%)",
                    },
                  }}
                >
                  Add Task
                </Button>
              </Stack>
            </Stack>
            <Card>
              <NewtaskListSearch
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
                // completed={completed}
                // pending={pending}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
              <NewtaskListTable
                // customers={customers}
                customersCount={customersCount}
                customers={currentTab === "all" ? customers : []}
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

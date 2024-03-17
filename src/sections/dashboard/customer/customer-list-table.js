import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../../../components/scrollbar';
import { paths } from '../../../paths';
import { getInitials } from '../../../utils/get-initials';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useRouter } from 'next/router';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

const useSelectionModel = (customers) => {
  const customerIds = useMemo(() => {
    return customers?.map((customer) => customer.member_user_id);
  }, [customers]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [customerIds]);

  const selectOne = useCallback((customerId) => {
    setSelected((prevState) => [...prevState, customerId]);
  }, []);

  const deselectOne = useCallback((customerId) => {
    setSelected((prevState) => {
      return prevState.filter((id) => id !== customerId);
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected([...customerIds]);
  }, [customerIds]);

  const deselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected
  };
};




export const CustomerListTable = (props) => {
  const {
    customers,
    customersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const { deselectAll, selectAll, deselectOne, selectOne, selected } = useSelectionModel(customers);

  console.log(customers);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (customerId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.delete(
        `${BASEURL}/admin/deleteUser/${customerId}`,
        { headers: headers }
      );
      if (response.status === 200) {
        enqueueSnackbar("Member deleted successfully", { variant: "success" });
        router.push(paths.dashboard.users.index);
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      console.log(err);
    }
  };

  const handleToggleAll = useCallback((event) => {
    const { checked } = event.target;

    if (checked) {
      selectAll();
    } else {
      deselectAll();
    }
  }, [selectAll, deselectAll]);

  const selectedAll = selected?.length === customers?.length;
  const selectedSome = selected?.length > 0 && selected?.length < customers?.length;
  const enableBulkActions = selected?.length > 0;

  return (
    <Box
      sx={{ position: 'relative' }}
      {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          {/* <Button
            color="inherit"
            size="small"
          >
            Delete
          </Button>
          <Button
            color="inherit"
            size="small"
          >
            Edit
          </Button> */}
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                TwitterId
              </TableCell>
              <TableCell>
                Coins
              </TableCell>
              <TableCell>
                Contact No.
              </TableCell>
              <TableCell align="right">
                Edit users
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((customer) => {
              const isSelected = selected.includes(customer.member_user_id);
              // const location = `${customer.city}, ${customer.state}, ${customer.country}`;
              // const totalSpent = numeral(customer.totalSpent).format(`${customer.currency}0,0.00`);

              return (
                <TableRow
                  hover
                  key={customer.member_user_id}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        const { checked } = event.target;

                        if (checked) {
                          selectOne(customer.member_user_id);
                        } else {
                          deselectOne(customer.member_user_id);
                        }
                      }}
                      value={isSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Avatar
                        src={customer.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(customer.member_name)}
                      </Avatar>
                      <div>
                        {/* <Link
                          color="inherit"
                          component={NextLink}
                          href={paths.dashboard.users.details}
                          variant="subtitle2"
                        > */}
                        {customer.member_name}
                        {/* </Link> */}
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {customer.email}
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {customer.twitterId}
                  </TableCell>
                  <TableCell>
                    {customer.coins}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {customer.contactNo}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={NextLink}
                      href={`${paths.dashboard.users.edit}${customer.member_user_id}/edit`}
                    >
                      <SvgIcon>
                        <Edit02Icon />
                      </SvgIcon>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(customer.member_user_id)}>
                      <SvgIcon>
                        <DeleteIcon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={customersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

CustomerListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

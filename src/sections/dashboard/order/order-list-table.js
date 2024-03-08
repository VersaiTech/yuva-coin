import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead, // Import TableHead component
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { SeverityPill } from '../../../components/severity-pill';

const statusMap = {
  complete: 'success',
  pending: 'info',
  canceled: 'warning',
  rejected: 'error'
};

export const OrderListTable = (props) => {
  const {
    onOrderSelect,
    onPageChange,
    onRowsPerPageChange,
    orders,
    ordersCount,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            // Ensure createdAt is a valid Date object before formatting
            const createdAtMonth = order.createdAt ? format(order.createdAt, 'LLL').toUpperCase() : '';
            const createdAtDay = order.createdAt ? format(order.createdAt, 'd') : '';
            const totalAmount = numeral(order.totalAmount).format(`${order.currency}0,0.00`);
            const statusColor = statusMap[order.status] || 'warning';

            return (
              <TableRow
                hover
                key={order.id}
                onClick={() => onOrderSelect?.(order.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                          ? 'neutral.800'
                          : 'neutral.200',
                        borderRadius: 2,
                        maxWidth: 'fit-content',
                        ml: 3,
                        p: 1
                      }}
                    >
                      <Typography
                        align="center"
                        variant="subtitle2"
                      >
                        {createdAtMonth}
                      </Typography>
                      <Typography
                        align="center"
                        variant="h6"
                      >
                        {createdAtDay}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle2">
                        {order.number}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        Total of {totalAmount}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">{order.details}</TableCell>
                <TableCell align="right">
                  <SeverityPill color={statusColor}>
                    {order.status}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={ordersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

OrderListTable.propTypes = {
  onOrderSelect: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  orders: PropTypes.array.isRequired,
  ordersCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';

interface Data  extends ICampaign { }


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'campaign',
    numeric: false,
    disablePadding: false,
    label: 'Campaign',
  },
  {
    id: 'campaign_id',
    numeric: false,
    disablePadding: false,
    label: 'Campaign ID',
  },
  {
    id: 'ad',
    numeric: false,
    disablePadding: false,
    label: 'Ad',
  },
  {
    id: 'ad_id',
    numeric: false,
    disablePadding: false,
    label: 'Ad ID',
  },
  {
    id: 'day',
    numeric: false,
    disablePadding: false,
    label: 'Day',
  },
  {
    id: 'spent',
    numeric: true,
    disablePadding: false,
    label: 'Spent',
  },
  {
    id: 'impressions',
    numeric: true,
    disablePadding: false,
    label: 'Impressions',
  },
  {
    id: 'clicks',
    numeric: true,
    disablePadding: false,
    label: 'Clicks',
  },
  {
    id: 'reach',
    numeric: true,
    disablePadding: false,
    label: 'Reach',
  },
  {
    id: 'views_25%',
    numeric: true,
    disablePadding: false,
    label: '25% Views',
  },
  {
    id: 'views_50%',
    numeric: true,
    disablePadding: false,
    label: '50% Views',
  },
  {
    id: 'views_75%',
    numeric: true,
    disablePadding: false,
    label: '75% Views',
  },
  {
    id: 'views_100%',
    numeric: true,
    disablePadding: false,
    label: '100% Views',
  },
  {
    id: 'sessions',
    numeric: true,
    disablePadding: false,
    label: 'Sessions',
  },
  {
    id: 'bounce_rate',
    numeric: true,
    disablePadding: false,
    label: 'Bounce Rate',
  },
  {
    id: 'average_session_duration',
    numeric: true,
    disablePadding: false,
    label: 'Avg Session Duration',
  },
  {
    id: 'pages_per_session',
    numeric: true,
    disablePadding: false,
    label: 'Pages Per Session',
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


interface IProps {
  data: ICampaign[];
}

export default function DataTable({ data }: IProps) {
  console.log(data);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('campaign');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.campaign);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => {
                  const isItemSelected = isSelected(data.campaign);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, data.campaign)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={data.campaign}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        {data.campaign}
                      </TableCell>
                      <TableCell align="right">{data.campaign_id}</TableCell>
                      <TableCell align="right">{data.ad}</TableCell>
                      <TableCell align="right">{data.ad_id}</TableCell>
                      <TableCell align="right">{data.day}</TableCell>
                      <TableCell align="right">{data.spent}</TableCell>
                      <TableCell align="right">{data.impressions}</TableCell>
                      <TableCell align="right">{data.clicks}</TableCell>
                      <TableCell align="right">{data.reach}</TableCell>
                      <TableCell align="right">{data['views_25%']}</TableCell>
                      <TableCell align="right">{data['views_50%']}</TableCell>
                      <TableCell align="right">{data['views_75%']}</TableCell>
                      <TableCell align="right">{data['views_100%']}</TableCell>
                      <TableCell align="right">{data.sessions}</TableCell>
                      <TableCell align="right">{data.bounce_rate}</TableCell>
                      <TableCell align="right">{data.average_session_duration}</TableCell>
                      <TableCell align="right">{data.pages_per_session}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

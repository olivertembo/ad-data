import * as React from 'react';
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
import { getComparator, stableSort } from '../../utils';

interface HeadCell {
  disablePadding: boolean;
  id: keyof ICampaign;
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
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ICampaign) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof ICampaign) => (event: React.MouseEvent<unknown>) => {
      console.log('createSortHandler', property);
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

export default function ICampaignTable({ data }: IProps) {

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ICampaign>('campaign_id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ICampaign,
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
                .map((_data, index) => {
                  console.log(`campaign-${index}`, _data);
                  const isItemSelected = isSelected(_data.campaign);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, _data.campaign)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`${_data.campaign}-${index}`}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        {_data.campaign}
                      </TableCell>
                      <TableCell align="right">{_data.campaign_id}</TableCell>
                      <TableCell align="right">{_data.ad}</TableCell>
                      <TableCell align="right">{_data.ad_id}</TableCell>
                      <TableCell align="right">{_data.day}</TableCell>
                      <TableCell align="right">{_data.spent}</TableCell>
                      <TableCell align="right">{_data.impressions}</TableCell>
                      <TableCell align="right">{_data.clicks}</TableCell>
                      <TableCell align="right">{_data.reach}</TableCell>
                      <TableCell align="right">{_data['views_25%']}</TableCell>
                      <TableCell align="right">{_data['views_50%']}</TableCell>
                      <TableCell align="right">{_data['views_75%']}</TableCell>
                      <TableCell align="right">{_data['views_100%']}</TableCell>
                      <TableCell align="right">{_data.sessions}</TableCell>
                      <TableCell align="right">{_data.bounce_rate*100}</TableCell>
                      <TableCell align="right">{_data.average_session_duration}</TableCell>
                      <TableCell align="right">{_data.pages_per_session}</TableCell>
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

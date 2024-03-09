import { faListCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Radio } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import * as React from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Button from '../Button';
import classNames from 'classnames/bind';
import styles from './Table.module.scss';
import { useContext } from 'react';

const cx = classNames.bind(styles);

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const {
        noedit,
        theme,
        edit,
        headCells,
        onSelectAllClick,
        order,
        orderBy,
        selectFunction,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        sx={{ color: theme === 'dark' ? '#fff' : '#000' }}
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ fontSize: '14px', color: theme === 'dark' ? '#fff' : '#000' }}
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
                {selectFunction && (
                    <TableCell
                        padding="normal"
                        sx={{ textAlign: 'center', fontSize: '14px', color: theme === 'dark' ? '#fff' : '#000' }}
                    >
                        Chọn chức năng
                    </TableCell>
                )}
                {edit && !noedit && (
                    <TableCell
                        padding="normal"
                        sx={{ textAlign: 'center', fontSize: '14px', color: theme === 'dark' ? '#fff' : '#000' }}
                    >
                        Sửa
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { noedit, title, numSelected, selected, handleAdd, handleDelete } = props;

    const { theme } = useContext(ThemeContext);

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                m: '15px 0',
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%', fontWeight: 600 }} variant="h6" id="tableTitle" component="div">
                    {title}
                </Typography>
            )}

            {numSelected > 0 ? (
                <IconButton onClick={() => handleDelete(selected)}>
                    <FontAwesomeIcon className={cx(theme === 'dark' ? 'dark' : '')} icon={faTrash} />
                </IconButton>
            ) : !noedit ? (
                <Button red onClick={handleAdd}>
                    Thêm
                </Button>
            ) : null}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({
    noedit = false,
    edit = true,
    deleteSuccess = false,
    headCells,
    rows,
    title,
    selectFunction = false,
    handleDelete,
    handleAdd,
    handleEdit,
    handleSelectFunction,
}) {
    const { theme } = React.useContext(ThemeContext);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        if (deleteSuccess) {
            setSelected([]);
        }
    }, [deleteSuccess]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const [selectedValue, setSelectedValue] = React.useState([]);

    const handleSelectRadio = async (event) => {
        const temp = event.target.value.split('_');
        setSelectedValue({
            ...selectedValue,
            [event.target.name]: event.target.value,
        });
        await handleSelectFunction(parseInt(temp[0]), temp[1] === 'approve' ? true : false);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rows],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                sx={{
                    width: '100%',
                    mb: 2,
                    backgroundColor: theme === 'dark' ? '#232323' : '#fff',
                    boxShadow:
                        theme === 'dark'
                            ? '#414345 0px 2px 8px 0px'
                            : '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                    color: theme === 'dark' ? '#fff' : '#000',
                }}
            >
                <EnhancedTableToolbar
                    noedit={noedit}
                    title={title}
                    numSelected={selected.length}
                    selected={selected}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                />
                <TableContainer>
                    <Table sx={{ minWidth: 728 }} aria-labelledby="tableTitle" size={'medium'}>
                        <EnhancedTableHead
                            theme={theme}
                            headCells={headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            selectFunction={selectFunction}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            edit={edit}
                            noedit={noedit}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                sx={{ color: theme === 'dark' ? '#fff' : '#000' }}
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            sx={{
                                                fontSize: '14px',
                                                color: theme === 'dark' ? '#fff' : '#000',
                                            }}
                                        >
                                            {row.id}
                                        </TableCell>
                                        {Object.keys(row).map((key, index) =>
                                            index === 0 ? null : (
                                                <TableCell
                                                    key={key}
                                                    align="left"
                                                    sx={{
                                                        fontSize: '14px',
                                                        color: theme === 'dark' ? '#fff' : '#000',
                                                    }}
                                                >
                                                    {row[key] === true || row[key] === false ? (
                                                        <Radio
                                                            sx={{ color: theme === 'dark' ? '#fff' : '#000' }}
                                                            checked={
                                                                selectedValue[`radio${row.id}`] !== undefined
                                                                    ? selectedValue[`radio${row.id}`] ===
                                                                      `${row.id}_${key}`
                                                                    : row[key]
                                                            }
                                                            onChange={(event) => handleSelectRadio(event)}
                                                            //Ngăn chặn sự kiện click từ lan truyền lên
                                                            onClick={(event) => event.stopPropagation()}
                                                            value={`${row.id}_${key}`}
                                                            name={`radio${row.id}`}
                                                            inputProps={{ 'aria-label': `radio${row.id}` }}
                                                        />
                                                    ) : (
                                                        row[key]
                                                    )}
                                                </TableCell>
                                            ),
                                        )}

                                        {selectFunction && (
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    fontSize: '14px',
                                                    color: theme === 'dark' ? '#fff' : '#000',
                                                    width: '20%',
                                                }}
                                                onClick={(event) => handleSelectFunction(event, row.id)}
                                            >
                                                <FontAwesomeIcon icon={faListCheck} />
                                            </TableCell>
                                        )}
                                        {edit && !noedit && (
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    fontSize: '14px',
                                                    color: theme === 'dark' ? '#fff' : '#000',
                                                    width: '20%',
                                                }}
                                                onClick={(event) => handleEdit(event, row.id)}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    sx={{ fontSize: '14px', color: theme === 'dark' ? '#fff' : '#000' }}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

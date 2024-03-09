import EnhancedTable from '../../../components/Table';
import classNames from 'classnames/bind';
import styles from './Permission.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LabelTextBox from '../../../components/LabelTextBox';
import Button from '../../../components/Button';
import ActionAlerts from '../../../components/Alert';
import { useState, useEffect, useContext } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import * as permissionServices from '../../../services/permissionServices';
import * as functionServices from '../../../services/functionServices';
import * as permission_functionServices from '../../../services/permission_functionServices';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function Permission() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Sử dụng useEffect để theo dõi thay đổi của screenWidth
    useEffect(() => {
        // Hàm xử lý khi screenWidth thay đổi
        function handleResize() {
            setScreenWidth(window.innerWidth);
        }

        // Thêm một sự kiện lắng nghe sự thay đổi của cửa sổ
        window.addEventListener('resize', handleResize);

        // Loại bỏ sự kiện lắng nghe khi component bị hủy
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const { theme } = useContext(ThemeContext);

    const [changeNameEdit, setChangeNameEdit] = useState(false);
    const [changeNameAdd, setChangeNameAdd] = useState(false);

    const [openSelectFunction, setOpenSelectFunction] = useState(false); //Mở dialog chọn quyền
    const [listPermission, setListPermission] = useState([]);
    const [listFunction, setListFunction] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [idPermissionSelect, setIdPermissionSelect] = useState(null);

    const [openCreate, setOpenCreate] = useState(false); //Mở dialog thêm

    const [openEdit, setOpenEdit] = useState(false); //Mở dialog edit

    const [confirmDelete, setConfirmDelete] = useState(false); //Mở dialog xóa

    const [listDelete, setListDelete] = useState([]);
    //Trạng thái cập nhật
    const [selectSuccess, setSelectSuccess] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    //Type đang được chỉnh sửa
    const [functionEdit, setFunctionEdit] = useState({});
    //Hiển thị hộp thoại thông báo
    const [alertType, setAlertType] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);

    const showAlert = (type) => {
        setAlertType(type);
        setAlertVisible(true);

        const timeoutId = setTimeout(() => {
            setAlertVisible(false);
            setAlertType(null); // Đặt alertType về null khi ẩn thông báo
        }, 2500);

        return timeoutId;
    };

    useEffect(() => {
        if (alertVisible) {
            const timeoutId = setTimeout(() => {
                setAlertVisible(false);
                setAlertType(null); // Đặt alertType về null khi ẩn thông báo
            }, 2500);

            return () => clearTimeout(timeoutId);
        }
    }, [alertVisible]);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await permissionServices.getAllPermission();
            setListPermission(result);
            setCreateSuccess(false);
            setDeleteSuccess(false);
            setUpdateSuccess(false);
            setSelectSuccess(false);
        };
        fetchApi();
    }, [createSuccess, deleteSuccess, updateSuccess, selectSuccess]);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await functionServices.getAllFunction();
            setListFunction(result);
        };
        fetchApi();
    }, []);

    function createData(id, name) {
        return {
            id,
            name,
        };
    }

    const rows = listPermission.map((permission) => {
        return createData(permission.id, permission.name);
    });

    //handle create
    const handleCreate = () => {
        setOpenCreate(true);
    };

    const handleCloseCreate = () => {
        setOpenCreate(false);
    };

    const handleSubmitCreate = async (event) => {
        event.preventDefault();

        setChangeNameAdd(true);

        const name = event.target.elements.name.value !== '' ? event.target.elements.name.value : null;

        if (name !== null) {
            const permission = {
                name,
            };
            const result = await permissionServices.add(permission);
            if (result) {
                setCreateSuccess(true);
                setOpenCreate(false);
                showAlert('create');
            }
        }
    };
    //Handle delete
    const handleDelete = async (selected) => {
        setListDelete(selected);
        setConfirmDelete(true);
    };
    const handleSubmitDelete = async (event) => {
        event.preventDefault();
        let deleteBool = true;
        listDelete.map(async (item) => {
            const result = await permissionServices.deleteById(item);
            if (result === undefined) {
                deleteBool = false;
            }
        });
        if (deleteBool) {
            setConfirmDelete(false);
            setDeleteSuccess(true);
            showAlert('delete');
        }
    };
    const handleCloseConfirm = () => {
        setConfirmDelete(false);
    };
    // HANDLE EDIT
    const handleEdit = async (event, id) => {
        event.stopPropagation();
        const result = await permissionServices.getPermissionById(id);
        setFunctionEdit(result);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
    const handleSubmitEdit = async (event) => {
        event.preventDefault();

        setChangeNameEdit(true);

        const id = functionEdit.id;
        const name = event.target.elements.nameEdit.value !== '' ? event.target.elements.nameEdit.value : null;

        if (name !== null) {
            const permission = { id, name };
            const result = await permissionServices.update(id, permission);
            if (result) {
                setOpenEdit(false);
                setUpdateSuccess(true);
                showAlert('edit');
            }
        }
    };

    // HANDLE SELECT FUNCTION
    const handleSelectFunction = async (event, id) => {
        event.stopPropagation();
        setIdPermissionSelect(id);
        const result = await permission_functionServices.getByPermissionId(id);

        // Tạo một bản sao của checkedItems để thực hiện thay đổi
        let updatedCheckedItems = { ...checkedItems };

        result.forEach((permission_function) => {
            listFunction.forEach((functionItem) => {
                if (functionItem.id === permission_function.function.id) {
                    // Thay đổi bản sao updatedCheckedItems
                    updatedCheckedItems = { ...updatedCheckedItems, [`id${functionItem.id}`]: true };
                }
            });
        });

        // Cập nhật checkedItems sau khi đã thay đổi
        setCheckedItems(updatedCheckedItems);
        setOpenSelectFunction(true);
    };
    const handleCloseSelectFunction = () => {
        setCheckedItems({});
        setOpenSelectFunction(false);
    };
    const handleSubmitSelectFunction = async (event) => {
        event.preventDefault();
        let addBool = true;
        const permissionId = idPermissionSelect;
        const permission = await permissionServices.getPermissionById(permissionId);
        const deleteByPermission = await permission_functionServices.deleteByPermission(permission);

        const trueKeys = [];

        for (const key in checkedItems) {
            if (checkedItems[key] === true) {
                trueKeys.push(key);
            }
        }

        trueKeys.map(async (key) => {
            let functionId = key.replace('id', '');
            functionId = parseInt(functionId);
            const functionObject = await functionServices.getFunctionById(functionId);
            const permission_function = { function: functionObject, permission: permission };
            const result = await permission_functionServices.add(permission_function);
            if (result === undefined) {
                addBool = false;
            }
        });
        if (addBool) {
            setOpenSelectFunction(false);
            setSelectSuccess(true);
            showAlert('select');
        }
    };

    const handleCheckboxChange = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'ID',
            width: '10px',
        },
        {
            id: 'name',
            numeric: true,
            disablePadding: false,
            label: 'Tên',
            width: '30%',
        },
    ];
    return (
        <div className={cx('wrapper')}>
            <EnhancedTable
                handleDelete={handleDelete}
                handleAdd={handleCreate}
                handleEdit={handleEdit}
                headCells={headCells}
                deleteSuccess={deleteSuccess}
                rows={rows}
                selectFunction
                handleSelectFunction={handleSelectFunction}
                title="Quản lý quyền"
            />
            <Dialog
                className={cx(theme === 'dark' ? 'dark' : '')}
                fullWidth={true}
                maxWidth="sm"
                open={openSelectFunction}
                onClose={handleCloseSelectFunction}
            >
                <form onSubmit={handleSubmitSelectFunction}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Chọn chức năng
                    </DialogTitle>
                    <DialogContent>
                        <FormGroup sx={{ margin: '20px 50px' }}>
                            {listFunction.map((item, index) => {
                                return (
                                    <FormControlLabel
                                        key={index}
                                        sx={{ marginBottom: '10px' }}
                                        control={
                                            <Checkbox
                                                name={`id${item.id}`}
                                                checked={
                                                    checkedItems[`id${item.id}`] !== undefined &&
                                                    checkedItems[`id${item.id}`]
                                                }
                                                sx={{ color: theme === 'dark' ? 'white' : 'black' }}
                                                onChange={(event) => handleCheckboxChange(event)}
                                                value={item.id}
                                            />
                                        }
                                        value={item.id}
                                        label={<span style={{ fontSize: '1.6rem' }}>{item.name}</span>}
                                    />
                                );
                            })}
                        </FormGroup>
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: '10px' }}>
                        <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseSelectFunction}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '14px' }} red type="submit">
                            Lưu
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog className={theme === 'dark' ? 'dark' : ''} fullWidth={true} maxWidth="sm" open={openEdit}>
                <form onSubmit={handleSubmitEdit}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Chỉnh sửa
                    </DialogTitle>
                    <DialogContent>
                        <LabelTextBox
                            name={'nameEdit'}
                            placeholder={'Tên quyền'}
                            label={'Tên quyền'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            text={functionEdit.name ? functionEdit.name : ''}
                            change={changeNameEdit}
                            setChange={setChangeNameEdit}
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'flex-end', margin: '10px' }}>
                        <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseEdit}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '14px' }} red type="submit">
                            Sửa
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                className={cx(theme === 'dark' ? 'dark' : '')}
                fullWidth={true}
                maxWidth="sm"
                open={openCreate}
                onClose={handleCloseCreate}
            >
                <form onSubmit={handleSubmitCreate}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Thêm quyền
                    </DialogTitle>
                    <DialogContent>
                        <LabelTextBox
                            name={'name'}
                            placeholder={'Tên quyền'}
                            label={'Tên quyền'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeNameAdd}
                            setChange={setChangeNameAdd}
                        />
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: '10px' }}>
                        <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseCreate}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '14px' }} red type="submit">
                            Tạo
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            {confirmDelete && (
                <Dialog
                    className={cx(theme === 'dark' ? 'dark' : '')}
                    fullWidth={true}
                    maxWidth="sm"
                    open={confirmDelete}
                >
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Xóa quyền?
                    </DialogTitle>
                    <form onSubmit={handleSubmitDelete}>
                        <DialogContent>Tất cả quyền đã chọn sẽ được xóa khỏi hệ thống.</DialogContent>
                        <DialogActions sx={{ marginBottom: '10px' }}>
                            <div>
                                <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseConfirm}>
                                    Hủy
                                </Button>
                                <Button style={{ fontSize: '14px', marginLeft: '8px' }} red type="submit">
                                    Xóa
                                </Button>
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
            {alertType === 'edit' && <ActionAlerts severity="success" content={`Đã chỉnh sửa thành công`} />}
            {alertType === 'create' && <ActionAlerts severity="success" content={`Đã thêm thành công`} />}
            {alertType === 'delete' && <ActionAlerts severity="success" content={`Đã xóa thành công`} />}
            {alertType === 'select' && <ActionAlerts severity="success" content={`Đã chọn chức năng thành công`} />}
        </div>
    );
}

export default Permission;

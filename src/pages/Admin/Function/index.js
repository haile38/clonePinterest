import EnhancedTable from '../../../components/Table';
import classNames from 'classnames/bind';
import styles from './Function.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LabelTextBox from '../../../components/LabelTextBox';
import Button from '../../../components/Button';
import ActionAlerts from '../../../components/Alert';
import * as functionServices from '../../../services/functionServices';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function Function() {
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

    const [listFunction, setListFunction] = useState([]);

    const [openCreate, setOpenCreate] = useState(false); //Mở dialog thêm

    const [openEdit, setOpenEdit] = useState(false); //Mở dialog edit

    const [confirmDelete, setConfirmDelete] = useState(false); //Mở dialog xóa

    const [listDelete, setListDelete] = useState([]);
    //Trạng thái cập nhật
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
            const result = await functionServices.getAllFunction();
            setListFunction(result);
            setCreateSuccess(false);
            setDeleteSuccess(false);
            setUpdateSuccess(false);
        };
        fetchApi();
    }, [createSuccess, deleteSuccess, updateSuccess]);

    function createData(id, name) {
        return {
            id,
            name,
        };
    }

    const rows = listFunction.map((functionItem) => {
        return createData(functionItem.id, functionItem.name);
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
            const functionItem = {
                name,
            };
            const result = await functionServices.add(functionItem);
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
            const result = await functionServices.deleteById(item);
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
        const result = await functionServices.getFunctionById(id);
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
            const functionItem = { id, name };
            const result = await functionServices.update(id, functionItem);
            if (result) {
                setOpenEdit(false);
                setUpdateSuccess(true);
                showAlert('edit');
            }
        }
    };
    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'ID',
        },
        {
            id: 'name',
            numeric: true,
            disablePadding: false,
            label: 'Tên',
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
                title="Quản lý chức năng"
            />
            <Dialog className={theme === 'dark' ? 'dark' : ''} fullWidth={true} maxWidth="sm" open={openEdit}>
                <form onSubmit={handleSubmitEdit}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Chỉnh sửa
                    </DialogTitle>
                    <DialogContent sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <LabelTextBox
                            name={'nameEdit'}
                            placeholder={'Tên chức năng'}
                            label={'Tên chức năng'}
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
                        Thêm chức năng
                    </DialogTitle>
                    <DialogContent sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <LabelTextBox
                            name={'name'}
                            placeholder={'Tên chức năng'}
                            label={'Tên chức năng'}
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
                        Xóa chức năng?
                    </DialogTitle>
                    <form onSubmit={handleSubmitDelete}>
                        <DialogContent>Tất cả chức năng đã chọn sẽ được xóa khỏi hệ thống.</DialogContent>
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
        </div>
    );
}

export default Function;

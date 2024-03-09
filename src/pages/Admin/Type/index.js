import EnhancedTable from '../../../components/Table';
import classNames from 'classnames/bind';
import styles from './Type.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LabelTextBox from '../../../components/LabelTextBox';
import Button from '../../../components/Button';
import ActionAlerts from '../../../components/Alert';
import * as typeServices from '../../../services/typeServices';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function Type() {
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

    const [listType, setListType] = useState([]);

    const [openCreate, setOpenCreate] = useState(false); //Mở dialog thêm

    const [openEdit, setOpenEdit] = useState(false); //Mở dialog edit

    const [confirmDelete, setConfirmDelete] = useState(false); //Mở dialog xóa

    const [listDelete, setListDelete] = useState([]);
    //Trạng thái cập nhật
    const [createSuccess, setCreateSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    //Type đang được chỉnh sửa
    const [typeEdit, setTypeEdit] = useState({});
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
            const result = await typeServices.getAllType();
            setListType(result);
            setCreateSuccess(false);
            setDeleteSuccess(false);
            setUpdateSuccess(false);
        };
        fetchApi();
    }, [createSuccess, deleteSuccess, updateSuccess]);

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'ID',
        },
        {
            id: 'typeName',
            numeric: true,
            disablePadding: false,
            label: 'Tên',
        },
    ];

    function createData(id, typeName) {
        return {
            id,
            typeName,
        };
    }

    const rows = listType.map((type) => {
        return createData(type.id, type.typeName);
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

        const typeName = event.target.elements.typeName.value !== '' ? event.target.elements.typeName.value : null;

        if (typeName !== null) {
            const type = {
                typeName,
            };
            const result = await typeServices.add(type);
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
            const result = await typeServices.deleteById(item);
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
        const result = await typeServices.getTypeById(id);
        setTypeEdit(result);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
    const handleSubmitEdit = async (event) => {
        event.preventDefault();

        setChangeNameEdit(true);

        const id = typeEdit.id;
        const typeName =
            event.target.elements.typeNameEdit.value !== '' ? event.target.elements.typeNameEdit.value : null;
        if (typeName !== null) {
            const type = { id, typeName };
            const result = await typeServices.update(id, type);
            if (result) {
                setOpenEdit(false);
                setUpdateSuccess(true);
                showAlert('edit');
            }
        }
    };
    return (
        <div className={cx('wrapper')}>
            <EnhancedTable
                handleDelete={handleDelete}
                handleAdd={handleCreate}
                handleEdit={handleEdit}
                headCells={headCells}
                deleteSuccess={deleteSuccess}
                rows={rows}
                title="Quản lý loại bài đăng"
            />
            <Dialog className={theme === 'dark' ? 'dark' : ''} fullWidth={true} maxWidth="sm" open={openEdit}>
                <form onSubmit={handleSubmitEdit}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Chỉnh sửa
                    </DialogTitle>
                    <DialogContent sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <LabelTextBox
                            name={'typeNameEdit'}
                            placeholder={'Tên loại'}
                            label={'Tên loại'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            text={typeEdit.typeName ? typeEdit.typeName : ''}
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
                        Thêm loại bài đăng
                    </DialogTitle>
                    <DialogContent sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <LabelTextBox
                            name={'typeName'}
                            placeholder={'Tên loại'}
                            label={'Tên loại'}
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
                        Xóa loại bài đăng?
                    </DialogTitle>
                    <form onSubmit={handleSubmitDelete}>
                        <DialogContent>Tất cả loại bài đăng đã chọn sẽ được xóa khỏi hệ thống.</DialogContent>
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

export default Type;

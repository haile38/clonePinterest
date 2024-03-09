import EnhancedTable from '../../../components/Table';
import classNames from 'classnames/bind';
import styles from './ContentReport.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LabelTextBox from '../../../components/LabelTextBox';
import Button from '../../../components/Button';
import ActionAlerts from '../../../components/Alert';
import * as contentReportServices from '../../../services/contentReportServices';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const cx = classNames.bind(styles);

function ContentReport() {
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
    //change input
    const [changeNameEdit, setChangeNameEdit] = useState(false);
    const [changeDiscriptionEdit, setChangeDiscriptionEdit] = useState(false);
    const [changeNameAdd, setChangeNameAdd] = useState(false);
    const [changeDiscriptionAdd, setChangeDiscriptionAdd] = useState(false);

    const [listContent, setListContent] = useState([]);

    const [openCreate, setOpenCreate] = useState(false); //Mở dialog thêm

    const [openEdit, setOpenEdit] = useState(false); //Mở dialog edit

    const [confirmDelete, setConfirmDelete] = useState(false); //Mở dialog xóa

    const [listDelete, setListDelete] = useState([]);
    //Trạng thái cập nhật
    const [createSuccess, setCreateSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    //Type đang được chỉnh sửa
    const [contentEdit, setContentEdit] = useState({});
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
            const result = await contentReportServices.getAllContent_Report();
            setListContent(result);
            setCreateSuccess(false);
            setDeleteSuccess(false);
            setUpdateSuccess(false);
        };
        fetchApi();
    }, [createSuccess, deleteSuccess, updateSuccess]);

    function createData(id, content, description) {
        return {
            id,
            content,
            description,
        };
    }

    const rows = listContent.map((content_report) => {
        return createData(content_report.id, content_report.content, content_report.description);
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

        setChangeDiscriptionAdd(true);
        setChangeNameAdd(true);

        const content = event.target.elements.content.value !== '' ? event.target.elements.content.value : null;
        const description =
            event.target.elements.description.value !== '' ? event.target.elements.description.value : null;

        if (content !== null && description !== null) {
            const content_report = {
                content,
                description,
            };
            const result = await contentReportServices.add(content_report);
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
            const result = await contentReportServices.deleteById(item);
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
        const result = await contentReportServices.getContent_ReportById(id);
        setContentEdit(result);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
    const handleSubmitEdit = async (event) => {
        event.preventDefault();

        setChangeNameEdit(true);
        setChangeDiscriptionEdit(true);

        const id = contentEdit.id;
        const content = event.target.elements.contentEdit.value !== '' ? event.target.elements.contentEdit.value : null;
        const description =
            event.target.elements.descriptionEdit.value !== '' ? event.target.elements.descriptionEdit.value : null;

        if (content !== null && description !== null) {
            const content_report = { id, content, description };
            const result = await contentReportServices.update(id, content_report);
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
            id: 'content',
            numeric: true,
            disablePadding: false,
            label: 'Nội dung',
        },
        {
            id: 'description',
            numeric: true,
            disablePadding: false,
            label: 'Mô tả',
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
                title="Quản lý nội dung báo cáo"
            />
            <Dialog
                className={cx(theme === 'dark' ? 'dark' : '')}
                fullWidth={true}
                maxWidth="sm"
                open={openEdit}
                onClose={handleCloseEdit}
            >
                <form onSubmit={handleSubmitEdit}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Chỉnh sửa
                    </DialogTitle>
                    <DialogContent>
                        <LabelTextBox
                            name={'contentEdit'}
                            placeholder={'Tên nội dung báo cáo'}
                            label={'Tên nội dung báo cáo'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            text={contentEdit.content ? contentEdit.content : ''}
                            change={changeNameEdit}
                            setChange={setChangeNameEdit}
                        />
                        <LabelTextBox
                            name={'descriptionEdit'}
                            placeholder={'Mô tả'}
                            label={'Mô tả'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            text={contentEdit.description ? contentEdit.description : ''}
                            change={changeDiscriptionEdit}
                            setChange={setChangeDiscriptionEdit}
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
                    <DialogContent>
                        <LabelTextBox
                            name={'content'}
                            placeholder={'Tên nội dung báo cáo'}
                            label={'Tên nội dung báo cáo'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeNameAdd}
                            setChange={setChangeNameAdd}
                        />
                        <LabelTextBox
                            area={true}
                            name={'description'}
                            placeholder={'Mô tả'}
                            label={'Mô tả'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeDiscriptionAdd}
                            setChange={setChangeDiscriptionAdd}
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
                        Xóa nội dung báo cáo?
                    </DialogTitle>
                    <form onSubmit={handleSubmitDelete}>
                        <DialogContent>Tất cả nội dung báo cáo đã chọn sẽ được xóa khỏi hệ thống.</DialogContent>
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

export default ContentReport;

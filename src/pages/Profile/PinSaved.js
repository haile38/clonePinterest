import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActionAlerts from '../../components/Alert';
import { ThemeContext } from '../../context/ThemeContext';
import Board from '../../components/Board';
import Button from '../../components/Button';
import { CreateBoardIcon, FilterIcon } from '../../components/Icons';
import LabelTextBox from '../../components/LabelTextBox';
import Popper from '../../components/Popper';
import OptionPopper from '../../components/Popper/OptionPopper';
import { AccountOtherContext } from '../../context/AccountOtherContext';
import * as boardServices from '../../services/boardServices';
import * as userSavePinServices from '../../services/userSavePinServices';
import * as userServices from '../../services/userServices';
import styles from './Profile.module.scss';
import Wrapper from './Wrapper';

const cx = classNames.bind(styles);

function PinSaved() {
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
    const [changeDiscriptionEdit, setChangeDiscriptionEdit] = useState(false);
    const [changeNameAdd, setChangeNameAdd] = useState(false);
    const [changeDiscriptionAdd, setChangeDiscriptionAdd] = useState(false);

    const navigate = useNavigate();
    const { accountOther } = useContext(AccountOtherContext);
    //Open hộp thoại edit
    const [openEdit, setOpenEdit] = useState(false);
    //Open hộp thoại add
    const [openCreateBoard, setOpenCreateBoard] = useState(false);
    const [listBoard, setListBoard] = useState([]);
    //Board đang được chỉnh sửa
    const [boardEdit, setBoardEdit] = useState({});
    //Trạng thái thành công
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [typeSort, setTypeSort] = useState('default');
    const [active, setActive] = useState('1');

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

    const handleActive = (id) => {
        setActive(id === active ? null : id);
    };

    // HANDLE EDIT
    const handleEdit = async (id) => {
        const result = await boardServices.getBoardById(id);
        setBoardEdit(result);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
    const handleSubmitEdit = async (event) => {
        event.preventDefault();

        setChangeDiscriptionEdit(true);
        setChangeNameEdit(true);

        const id = boardEdit.id;
        const user = boardEdit.user;
        const description =
            event.target.elements.descriptionEdit.value !== '' ? event.target.elements.descriptionEdit.value : null;
        const name = event.target.elements.nameEdit.value !== '' ? event.target.elements.nameEdit.value : null;

        const createdAt = null;

        if (description !== null && name !== null) {
            const board = { id, description, name, user, createdAt };
            const result = await boardServices.update(id, board);
            if (result) {
                setOpenEdit(false);
                setUpdateSuccess(true);
                showAlert('edit');
            }
        }
    };
    // HANDLE DELETE
    const handleDelete = async () => {
        setOpenEdit(false);
        setConfirmDelete(true);
    };
    const handleSubmitDelete = async (event) => {
        event.preventDefault();
        const result = await boardServices.deleteById(boardEdit.id);
        if (result) {
            setOpenEdit(false);
            setConfirmDelete(false);
            setDeleteSuccess(true);
            showAlert('delete');
        }
    };
    const handleCloseConfirm = () => {
        setOpenEdit(true);
        setConfirmDelete(false);
    };

    //HANLDE CREATE
    const handleCreateBoard = () => {
        setOpenCreateBoard(true);
    };

    const handleSubmitCreate = async (event) => {
        event.preventDefault();

        setChangeDiscriptionAdd(true);
        setChangeNameAdd(true);

        const user = await userServices.getUserByUsername(pathname);
        const description =
            event.target.elements.descriptionAdd.value !== '' ? event.target.elements.descriptionAdd.value : null;
        const name = event.target.elements.nameAdd.value !== '' ? event.target.elements.nameAdd.value : null;
        const createdAt = null;

        if (description !== null && name !== null) {
            const board = { description, name, user, createdAt };
            const result = await boardServices.add(board);

            if (result) {
                setOpenCreateBoard(false);
                setCreateSuccess(true);
                showAlert('create');
            }
        }
    };

    const handleCloseCreateBoard = () => {
        setOpenCreateBoard(false);
    };

    const location = useLocation();
    const pathname = location.pathname.split('/')[1];

    useEffect(() => {
        const fetchApi = async () => {
            let result = await boardServices.getBoardByUsername(pathname);
            if (typeSort === 'AtoZ') {
                result = [...result].sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            }
            setListBoard(result);

            const promises = result.map(async (board) => {
                const resultPin = await userSavePinServices.getPinByUserIdAndBoardId(pathname, board.id);
                let detailBoard = [];
                resultPin.map((pin) => {
                    return (detailBoard = [...detailBoard, pin.image]);
                });
                return detailBoard;
            });
            // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
            Promise.all(promises)
                .then((results) => {
                    // Khi tất cả promise đã hoàn thành, gộp kết quả vào listPin
                    setListBoard(
                        result.map((board, index) => {
                            return {
                                ...board,
                                detailBoard: results[index],
                            };
                        }),
                    );
                    setCreateSuccess(false);
                    setUpdateSuccess(false);
                    setDeleteSuccess(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        fetchApi();
    }, [pathname, updateSuccess, createSuccess, deleteSuccess, typeSort]);

    const filterBoardPopper = {
        title: 'Sắp xếp theo',
        item: [
            {
                id: '1',
                content: 'Mặc định',
                handleClick: () => setTypeSort('default'),
                handleActive: () => handleActive('1'),
                active: active,
            },
            {
                id: '2',
                content: 'A đến Z',
                handleClick: () => setTypeSort('AtoZ'),
                handleActive: () => handleActive('2'),
                active: active,
            },
        ],
        width: '270px',
    };

    const createBoardPopper = {
        title: 'Tạo',
        item: [
            {
                id: '1',
                content: 'Ghim',
                handleClick: () => {
                    navigate('/create');
                },
            },
            { id: '2', content: 'Bảng', handleClick: handleCreateBoard },
        ],
        width: '150px',
    };
    return (
        <Wrapper>
            <div className={cx('wrapper-pin-saved')}>
                {accountOther ? null : (
                    <div className={cx('option')}>
                        <Popper
                            title={<FilterIcon className={cx('action', 'icon', theme === 'dark' ? 'dark' : '')} />}
                            body={<OptionPopper data={filterBoardPopper} />}
                            widthBody="maxContent"
                            placement="bottom-start"
                        />
                        <Popper
                            title={<CreateBoardIcon className={cx('action', 'icon', theme === 'dark' ? 'dark' : '')} />}
                            body={<OptionPopper data={createBoardPopper} />}
                            widthBody="maxContent"
                            placement="bottom-end"
                        />
                    </div>
                )}
                <div className={cx('pin-saved')}>
                    {listBoard.map((board, index) => {
                        return (
                            <Board
                                key={index}
                                id={board.id}
                                title={board.name}
                                detailBoard={board.detailBoard}
                                countPin={board.count}
                                createdAt={board.created_at}
                                accountOther={accountOther}
                                handleEdit={() => handleEdit(board.id)}
                            />
                        );
                    })}
                </div>
                <Dialog className={theme === 'dark' ? 'dark' : ''} fullWidth={true} maxWidth="sm" open={openEdit}>
                    <form onSubmit={handleSubmitEdit}>
                        <DialogTitle
                            sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}
                        >
                            Chỉnh sửa
                        </DialogTitle>
                        <DialogContent>
                            <LabelTextBox
                                name={'nameEdit'}
                                placeholder={'Tiêu đề'}
                                label={'Tên bảng'}
                                selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                                text={boardEdit.name ? boardEdit.name : ''}
                                change={changeNameEdit}
                                setChange={setChangeNameEdit}
                            />
                            <LabelTextBox
                                name={'descriptionEdit'}
                                placeholder={'Mô tả'}
                                label={'Mô tả'}
                                selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                                text={boardEdit.description ? boardEdit.description : ''}
                                change={changeDiscriptionEdit}
                                setChange={setChangeDiscriptionEdit}
                            />
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'space-between', margin: '10px' }}>
                            <Button style={{ fontSize: '14px' }} primary type="button" onClick={handleDelete}>
                                Xóa
                            </Button>
                            <div>
                                <Button
                                    style={{ fontSize: '14px', marginRight: '8px' }}
                                    type="button"
                                    onClick={handleCloseEdit}
                                >
                                    Hủy
                                </Button>
                                <Button style={{ fontSize: '14px' }} red type="submit">
                                    Sửa
                                </Button>
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
                <Dialog
                    className={theme === 'dark' ? 'dark' : ''}
                    fullWidth={true}
                    maxWidth="sm"
                    open={openCreateBoard}
                    onClose={handleCloseCreateBoard}
                >
                    <form onSubmit={handleSubmitCreate}>
                        <DialogTitle
                            sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}
                        >
                            Tạo bảng
                        </DialogTitle>
                        <DialogContent>
                            <LabelTextBox
                                name={'nameAdd'}
                                placeholder={'Tiêu đề'}
                                label={'Tên bảng'}
                                selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                                change={changeNameAdd}
                                setChange={setChangeNameAdd}
                            />
                            <LabelTextBox
                                name={'descriptionAdd'}
                                placeholder={'Mô tả'}
                                label={'Mô tả'}
                                selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                                change={changeDiscriptionAdd}
                                setChange={setChangeDiscriptionAdd}
                            />
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '10px' }}>
                            <Button
                                style={{ fontSize: '14px', marginRight: '8px' }}
                                type="button"
                                onClick={handleCloseCreateBoard}
                            >
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
                        className={theme === 'dark' ? 'dark' : ''}
                        fullWidth={true}
                        maxWidth="sm"
                        open={confirmDelete}
                    >
                        <DialogTitle
                            sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}
                        >
                            Xóa Bảng này ?
                        </DialogTitle>
                        <form onSubmit={handleSubmitDelete}>
                            <DialogContent>
                                Bảng và tất cả các Ghim thuộc bảng này sẽ bị xóa khỏi hồ sơ của bạn.
                            </DialogContent>
                            <DialogActions sx={{ marginBottom: '10px' }}>
                                <div>
                                    <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseConfirm}>
                                        Hủy
                                    </Button>
                                    <Button style={{ fontSize: '14px' }} red type="submit">
                                        Xóa
                                    </Button>
                                </div>
                            </DialogActions>
                        </form>
                    </Dialog>
                )}
            </div>
            {alertType === 'edit' && <ActionAlerts severity="success" content={`Đã chỉnh sửa thành công`} />}
            {alertType === 'create' && <ActionAlerts severity="success" content={`Đã thêm thành công`} />}
            {alertType === 'delete' && <ActionAlerts severity="success" content={`Đã xóa thành công`} />}
        </Wrapper>
    );
}

export default PinSaved;

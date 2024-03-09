import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import styles from './Pin.module.scss';
import { ShareIcon, DownloadIcon, AccessIcon, EditIcon, DeleteIcon } from '../Icons';
import AccountInfo from '../AccountInfo';
import Button from '../Button';
import SelectBoardPopper from '../Popper/SelectBoardPopper';
import Popper from '../Popper';
import * as userSavePinServices from '../../services/userSavePinServices';
import * as pinServices from '../../services/pinServices';
import * as boardServices from '../../services/boardServices';
import * as userServices from '../../services/userServices';
import SharePopper from '../Popper/SharePopper';
import { NavLink, useLocation } from 'react-router-dom';
import { AccountLoginContext } from '../../context/AccountLoginContext';
import DialogConfirmLogin from '../DialogConfirmLogin';
import { NotificationContext } from '../../context/NotificationContext';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import LabelTextBox from '../LabelTextBox';
import { ThemeContext } from '../../context/ThemeContext';

const cx = classNames.bind(styles);

function Pin({
    stt,
    id,
    image,
    linkImage,
    title,
    userImage,
    username,
    pinCreated = false,
    pinSaved = false,
    handleEdit,
    onSaveResult,
    showAlert,
}) {
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
    const [changeName, setChangeName] = useState(false);
    const [changeDiscription, setChangeDiscription] = useState(false);
    const { userId, permission } = useContext(AccountLoginContext);
    const [activeOptionTop, setActiveOptionTop] = useState(false);
    const [activeOptionBottom, setActiveOptionBottom] = useState(false);
    const [openConfirmLogin, setOpenConfirmLogin] = useState(false);
    const { updatePinCount } = useContext(NotificationContext);

    const handleOpenShare = () => {
        setActiveOptionBottom(true);
    };

    const handleDisplaySelectBoardPopper = (e) => {
        setActiveOptionTop(true);
    };
    const handleClickAwaySelectBoard = () => {
        setActiveOptionTop(false);
    };
    const handleClickAwayShare = () => {
        setActiveOptionBottom(false);
    };

    const [data, setData] = useState({ name: 'Chọn bảng' });

    const getData = (board) => {
        setData(board);
    };
    const handleSave = () => {
        const fetchApi = async () => {
            const user = await userServices.getUserById(userId);

            const pinId = id;
            const boardId = data.id;
            const pin = await pinServices.getPinById(pinId);
            const board = await boardServices.getBoardById(boardId);

            const listPinSaved = await userSavePinServices.getPinByUserIdAndBoardId(user.username, boardId);
            const foundPin = listPinSaved.find((obj) => obj.id === pinId);
            if (foundPin) {
                showAlert('errorSavePinSaved');
            } else {
                if (pin.user.id === userId) {
                    showAlert('errorSave');
                } else {
                    const userSavePin = { user, pin, board };
                    const result = await userSavePinServices.save(userSavePin);
                    if (result) {
                        onSaveResult(true);
                        setData({ name: 'Chọn bảng' });

                        {
                            // Tăng biến đếm để tạo thông báo bài pin liên quan
                            const pinCount = localStorage.getItem('pinCount');
                            const existingArray = pinCount ? JSON.parse(pinCount) : [];
                            const pinCountList = [...existingArray, { id: id }];

                            localStorage.setItem('pinCount', JSON.stringify(pinCountList));
                            console.log(pinCountList.length);
                            if (pinCountList.length === 4) {
                                updatePinCount(pinCountList);
                                localStorage.setItem('pinCount', []);
                            }
                            console.log(pinCount);
                        }
                    }
                }
            }
        };
        if (permission !== null) {
            showAlert('errorAdmin');
        } else if (userId !== 0) {
            if (data.name === 'Chọn bảng') {
                showAlert('warning');
            } else {
                fetchApi();
            }
        } else {
            setOpenConfirmLogin(true);
        }
    };
    const location = useLocation();
    const currentPath = location.pathname;

    // Tìm boardId từ đường dẫn hiện tại
    const boardIdCurrent = currentPath.split('/')[3]; // Lấy phần tử đầu tiên trong mảng chia tách bởi "/"

    const handleChange = () => {
        const fetchApi = async () => {
            const boardId = data.id;
            const user = await userServices.getUserById(userId);
            const pinId = id;
            const pin = await pinServices.getPinById(pinId);
            const board = await boardServices.getBoardById(boardId);

            const userSavePin = { user, pin, board };
            const result = await userSavePinServices.update(userSavePin);
            if (result) {
                showAlert('changeSuccess');
                setData({ name: 'Chọn bảng' });
            }
        };
        if (data.name === 'Chọn bảng') {
            showAlert('warning');
        } else {
            fetchApi();
        }
    };

    const handleDelete = () => {
        const fetchApi = async () => {
            const user = await userServices.getUserById(userId);
            const pin = await pinServices.getPinById(id);
            const board = await boardServices.getBoardById(boardIdCurrent);

            const userSavePin = { board: board, pin: pin, user: user };

            const result = await userSavePinServices.del(userSavePin);
            if (result) {
                showAlert('deleteSuccess');
            }
        };
        fetchApi();
    };
    const download = (url, title) => {
        const linkSource = `data:image/jpeg;base64,${url}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = `${title}.png`;
        downloadLink.click();
    };

    const openImage = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDisplayPin = (e) => {
        if (userId === 0) {
            e.preventDefault();
            setOpenConfirmLogin(true);
        }
    };

    // handle CreateBoard
    const [showCreateBoard, setShowCreateBoard] = React.useState(false);

    const handleTurnOnCreateBoard = (isShown) => {
        setShowCreateBoard(isShown);
    };
    const handleCloseCreateBoard = () => {
        setShowCreateBoard(false);
    };

    const handleSubmitCreate = async (event) => {
        event.preventDefault();

        setChangeDiscription(true);
        setChangeName(true);

        const user = await userServices.getUserById(userId);
        const description =
            event.target.elements.descriptionAdd.value !== '' ? event.target.elements.descriptionAdd.value : null;
        const name = event.target.elements.nameAdd.value !== '' ? event.target.elements.nameAdd.value : null;
        const createdAt = null;

        if (name !== null && description !== null) {
            const board = { description, name, user, createdAt };
            const result = await boardServices.add(board);
            if (result) {
                setShowCreateBoard(false);
                showAlert('create');
            }
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container-image')}>
                    <NavLink
                        className={(nav) => cx('menu-item')}
                        to={`/pin/${id}`}
                        onClick={(e) => handleDisplayPin(e)}
                    >
                        <img className={cx('image')} src={image && `data:image/jpeg;base64,${image}`} alt="" />
                    </NavLink>
                    {userId ? (
                        pinCreated ? null : (
                            <div className={cx('option-top', { active: activeOptionTop })}>
                                <ClickAwayListener onClickAway={handleClickAwaySelectBoard}>
                                    <button
                                        className={cx('select-board-btn')}
                                        onClick={() => handleDisplaySelectBoardPopper()}
                                    >
                                        <Popper
                                            idPopper={`selectBoard${stt}`}
                                            contentTitle={data.name}
                                            title={<FontAwesomeIcon icon={faChevronDown} />}
                                            className={cx('select-board')}
                                            body={
                                                <SelectBoardPopper
                                                    getData={getData}
                                                    handleTurnOnCreateBoard={handleTurnOnCreateBoard}
                                                    idBoardCurrent={pinSaved ? Number(boardIdCurrent) : null}
                                                />
                                            }
                                            widthBody="maxContent"
                                        />
                                    </button>
                                </ClickAwayListener>

                                {pinSaved ? (
                                    <Button className={cx('changeBtn')} red onClick={handleChange}>
                                        Đổi
                                    </Button>
                                ) : (
                                    <Button className={cx('saveBtn')} red onClick={handleSave}>
                                        Lưu
                                    </Button>
                                )}
                            </div>
                        )
                    ) : null}
                    <div className={cx('option-bottom', { active: activeOptionBottom })}>
                        {linkImage && (
                            <button onClick={() => openImage(linkImage)} className={cx('btn-text')}>
                                <AccessIcon className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')} />
                                <span className={cx('link-image')}>{linkImage}</span>
                            </button>
                        )}

                        {userId ? (
                            <ClickAwayListener onClickAway={handleClickAwayShare}>
                                <div>
                                    <Tippy delay={[0, 100]} content="Chia sẻ" placement="bottom">
                                        <button onClick={handleOpenShare} className={cx('btn')}>
                                            <Popper
                                                idPopper={`share${id}`}
                                                contentTitle={
                                                    <ShareIcon className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')} />
                                                }
                                                className={cx('share-menu')}
                                                body={<SharePopper pin_id={id} />}
                                                widthBody="maxContent"
                                            />
                                        </button>
                                    </Tippy>
                                </div>
                            </ClickAwayListener>
                        ) : null}
                        {pinCreated && (
                            <div>
                                <Tippy delay={[0, 100]} content="Chỉnh sửa" placement="bottom">
                                    <button className={cx(pinCreated ? 'btn-end' : 'btn')} onClick={handleEdit}>
                                        <EditIcon className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')} />
                                    </button>
                                </Tippy>
                            </div>
                        )}
                        {pinSaved && (
                            <div className={cx('option')}>
                                <Tippy delay={[0, 100]} content="Xóa" placement="bottom">
                                    <button className={cx(pinSaved ? 'btn-end' : 'btn')} onClick={handleDelete}>
                                        <DeleteIcon className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')} />
                                    </button>
                                </Tippy>
                            </div>
                        )}
                        {pinCreated || pinSaved ? null : (
                            <div>
                                <Tippy delay={[0, 100]} content="Lưu ảnh" placement="bottom">
                                    <button
                                        onClick={() => {
                                            download(image, title);
                                        }}
                                        className={cx('btn-end')}
                                    >
                                        <DownloadIcon className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')} />
                                    </button>
                                </Tippy>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('info-pin')}>
                    {title && <h3>{title}</h3>}
                    {pinCreated ? null : <AccountInfo userImage={userImage} username={username} />}
                </div>
            </div>
            {openConfirmLogin && <DialogConfirmLogin open={openConfirmLogin} setOpen={setOpenConfirmLogin} />}

            <Dialog
                className={cx(theme === 'dark' ? 'dark' : '')}
                fullWidth={true}
                maxWidth="sm"
                open={showCreateBoard}
                onClose={handleCloseCreateBoard}
            >
                <form onSubmit={handleSubmitCreate}>
                    <DialogTitle sx={{ marginTop: '10px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>
                        Tạo bảng
                    </DialogTitle>
                    <DialogContent>
                        <LabelTextBox
                            name={'nameAdd'}
                            placeholder={'Tiêu đề'}
                            label={'Tên bảng'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeName}
                            setChange={setChangeName}
                            // text={boardEdit.name ? boardEdit.name : ''}
                        />
                        <LabelTextBox
                            name={'descriptionAdd'}
                            placeholder={'Mô tả'}
                            label={'Mô tả'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeDiscription}
                            setChange={setChangeDiscription}
                            // text={boardEdit.description ? boardEdit.description : ''}
                        />
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: '10px' }}>
                        <Button style={{ fontSize: '14px' }} type="button" onClick={handleCloseCreateBoard}>
                            Hủy
                        </Button>
                        <Button style={{ fontSize: '14px' }} red type="submit">
                            Tạo
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default Pin;

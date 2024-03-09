import classNames from 'classnames/bind';
import styles from './DisplayPin.module.scss';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { ShareIcon, DownloadIcon, ReportIcon } from '../../components/Icons';
import AccountInfo from '../../components/AccountInfo';
import Button from '../../components/Button';
import Popper from '../../components/Popper';
import SelectBoardPopper from '../../components/Popper/SelectBoardPopper';
import ActionAlerts from '../../components/Alert';
import SelectReportOption from '../../components/SelectReportOption';
import CommentApp from '../../components/Comment';
import LikeCard from '../../components/LikeCard';
import * as userServices from '../../services/userServices';
import * as pinServices from '../../services/pinServices';
import * as userSavePinServices from '../../services/userSavePinServices';
import * as boardServices from '../../services/boardServices';
import * as commentServices from '../../services/commentServices';
import { AccountLoginContext } from '../../context/AccountLoginContext';
import { ThemeContext } from '../../context/ThemeContext';
import { CircularProgress } from '@mui/material';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import LabelTextBox from '../../components/LabelTextBox';
import SharePopper from '../../components/Popper/SharePopper';
import { StompContext } from '../../context/StompContext';
import { AccountOtherContext } from '../../context/AccountOtherContext';

const cx = classNames.bind(styles);
let stompClient = null;

function DisplayPin() {
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

    const [currentUser, setCurrentUser] = useState('');

    const [changeName, setChangeName] = useState(false);
    const [changeDiscription, setChangeDiscription] = useState(false);

    const { theme } = useContext(ThemeContext);
    const { userId, permission } = useContext(AccountLoginContext);

    // console.log(userId);

    useEffect(() => {
        const fetchApi = async () => {
            const user = await userServices.getUserById(userId);
            setCurrentUser(user);
        };

        fetchApi();
    }, []);

    const location = useLocation();
    const pinID = location.pathname.split('/')[2];
    const [pin, setPin] = useState({});
    const [currentBoard, setBoard] = useState({ name: 'Chọn bảng' });
    const [img, setIMG] = useState();
    const [valContent, setValContent] = useState('');
    const [valTitle, setValTitle] = useState('');
    const [user, setUser] = useState('');
    const [load, setLoad] = useState(true);
    const [loadUser, setLoadUser] = useState(true);
    const [loadComment, setLoadComment] = useState(false);
    //load tất cả comment lần đầu
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
            const pin = await pinServices.getPinById(pinID);
            setPin(pin);
            setIMG(pin.image);
            setValContent(pin.description);
            setValTitle(pin.title);
            setUser(pin.user);

            setLoadUser(false);
        };
        fetchApi();
    }, []);

    //auto resize textarea
    const titleRef = React.useRef();
    const contentRef = React.useRef();
    const autoResize = (ref) => {
        if (ref && ref.current) {
            ref.current.style.height = '0px';
            const taHeight = ref.current.scrollHeight;
            ref.current.style.height = taHeight + 'px';
        }
    };
    React.useEffect(
        () => {
            autoResize(titleRef);
            autoResize(contentRef);
        },
        [valTitle],
        [valContent],
    );

    // HandleChooseBoard
    const [activeOptionTop, setActiveOptionTop] = useState(false);

    const handleClickAway = () => {
        setActiveOptionTop(false);
    };
    const handleDisplay = () => {
        setActiveOptionTop(true);
    };
    const handleChooseBoard = (currentBoard) => {
        setBoard(currentBoard);
    };

    //save pin
    const handleInsertPin = async () => {
        if (permission !== null) {
            showAlert('errorAdmin');
        } else if (pin.user.id === userId) {
            showAlert('errorSave');
        } else if (currentBoard.name !== 'Chọn bảng') {
            const board = currentBoard;
            const pinSaved = { board, pin, user };
            const result = await userSavePinServices.save(pinSaved);

            showAlert('saveSuccess');
        } else {
            showAlert('errorBoard');
        }
    };

    // Turn on select report
    const [showSelectReport, setShowSelectReport] = React.useState(false);
    const [reportedComment, setReportedComment] = useState(undefined);
    const handleTurnOnSelectReport = (isShown, comment = {}) => {
        setShowSelectReport(isShown);
        setReportedComment(comment);
    };

    //handle comment
    let comments = useRef([]);
    const [newComment, setNewComment] = useState('');
    const [submitComment, setSubmitComment] = useState(false);
    useEffect(() => {
        let stompObject = null;
        const fetchData = async () => {
            comments.current = await commentServices.getByPinId(pinID);
            setLoad(false);
        };
        const createStompConnect = () => {
            const socket = new SockJS('http://localhost:8080/ws');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompObject = stompClient.subscribe(`/room/comment/pin_id/${pinID}`, function (comment) {
                    handleCommentSubmit(JSON.parse(comment.body));
                    setSubmitComment(false);
                });
            });
        };
        createStompConnect();
        fetchData();
        return () => {
            stompClient.unsubscribe(stompObject.id);
        };
    }, [submitComment]);

    const [scroll, setScroll] = useState(false);
    const handleCommentSubmit = (comment) => {
        comments.current = [...comments.current, comment];
        setScroll(true);
        setNewComment('');
        setLoadComment(false);
    };
    const sendComment = () => {
        setLoadComment(true);

        stompClient.publish({
            destination: `/app/sendNot/${pin.user.id}`,
            body: JSON.stringify({
                notifications: { notificationType: 'Comment' },
                comments: {
                    user: { id: currentUser.id },
                    pin: { id: pin.id },
                    content: newComment,
                },
            }),
        });

        setSubmitComment(true);
        setRed(false);
    };
    const handlePressEnter = (event) => {
        if (event.key === 'Enter') {
            sendComment();
        }
    };
    //red button
    const [red, setRed] = useState(false);
    const changeBtn = (e) => {
        const current = e.target.value;
        if (current.length >= 1) {
            setRed(true);
        } else {
            setRed(false);
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

    //download img
    const download = () => {
        const linkSource = `data:image/jpeg;base64,${img}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = `${valTitle}.png`;
        downloadLink.click();
    };

    return (
        <div className={cx('wrapper-createPage')}>
            <div className={cx('createBox')}>
                {loadUser ? (
                    <CircularProgress sx={{ display: 'flex', margin: '0 auto' }} />
                ) : (
                    <div className={cx('mainContent')}>
                        <div className={cx('imgWrapper')}>
                            <img src={img && `data:image/jpeg;base64,${img}`} alt="" />
                        </div>
                        {/* end upload IMG */}
                        <div className={cx('insertData')}>
                            <div className={cx('wrapperBtns')}>
                                <div className={cx('option-bottom')}>
                                    {user.id !== userId && (
                                        <Tippy delay={[0, 100]} content="Báo cáo" placement="bottom">
                                            <button
                                                className={cx('btn-end', 'report-btn')}
                                                onClick={() => handleTurnOnSelectReport(true)}
                                            >
                                                <ReportIcon
                                                    width="2.4rem"
                                                    height="2.4rem"
                                                    className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')}
                                                />
                                            </button>
                                        </Tippy>
                                    )}
                                    <Tippy delay={[0, 100]} content="Chia sẻ" placement="bottom">
                                        <button className={cx('btn-end', 'share-btn')}>
                                            <ShareIcon
                                                width="2.0rem"
                                                height="2.0rem"
                                                className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')}
                                            />
                                        </button>
                                    </Tippy>
                                    <Tippy delay={[0, 100]} content="Lưu ảnh" placement="bottom">
                                        <button
                                            className={cx('btn-end', 'saveIMG-btn')}
                                            onClick={() => {
                                                download();
                                            }}
                                        >
                                            <DownloadIcon
                                                width="2.0rem"
                                                height="2.0rem"
                                                className={cx('action', 'gUZ', 'R19', 'U9O', 'kVc')}
                                            />
                                        </button>
                                    </Tippy>
                                </div>
                                {userId !== user.id && (
                                    <div className={cx('wrapperBoardandSaveBtn')}>
                                        <div className={cx('option-top', { active: activeOptionTop })}>
                                            <ClickAwayListener onClickAway={handleClickAway}>
                                                <button
                                                    className={cx('select-board-btn')}
                                                    onClick={() => handleDisplay()}
                                                >
                                                    <Popper
                                                        contentTitle={currentBoard.name}
                                                        // contentTitle={currentBoard.name}
                                                        title={<FontAwesomeIcon icon={faChevronDown} />}
                                                        className={cx('select-board')}
                                                        body={
                                                            <SelectBoardPopper
                                                                getData={handleChooseBoard}
                                                                handleTurnOnCreateBoard={handleTurnOnCreateBoard}
                                                            />
                                                        }
                                                        widthBody="maxContent"
                                                    />
                                                </button>
                                            </ClickAwayListener>
                                        </div>
                                        <div className={cx('save-pin')}>
                                            <Button className={cx('save-btn')} onClick={() => handleInsertPin()} red>
                                                Lưu
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* end header  */}
                            <div className={cx('info-pin-container')}>
                                <div className={cx('title')}>
                                    <div className={cx('inputTitle', theme === 'dark' ? 'dark' : '')}>{valTitle}</div>
                                </div>
                                <div className={cx('content')}>
                                    <div className={cx('inputContent', theme === 'dark' ? 'dark' : '')}>
                                        {valContent}
                                    </div>
                                </div>
                                <div className={cx('container-user')}>
                                    <AccountInfo userImage={user.avatar} username={user.username} />
                                    {userId === user.id ? null : (
                                        <Button className={cx('addFriendBtn')} primary>
                                            Kết bạn
                                        </Button>
                                    )}
                                </div>
                                {/* comment & like  */}
                                <div className={cx('comment-container')}>
                                    <div className={cx('like')}>
                                        <h3 className={cx('comment-title')}>Nhận xét</h3>
                                        <LikeCard pinID={pinID} currentUser={currentUser} />
                                    </div>
                                    <CommentApp
                                        scroll={scroll}
                                        setScroll={setScroll}
                                        comments={comments}
                                        currentUser={currentUser}
                                        handleTurnOnSelectReport={handleTurnOnSelectReport}
                                    />
                                </div>
                            </div>
                            <div className={cx('comment-input')}>
                                <div className={cx('userComment')}>
                                    <AccountInfo userImage={currentUser.avatar} username={' '} />
                                </div>
                                <div className={cx('comment')}>
                                    <input
                                        type="text"
                                        placeholder="Thêm nhận xét"
                                        value={newComment}
                                        onChange={(e) => {
                                            setNewComment(e.target.value);
                                            changeBtn(e);
                                        }}
                                        onKeyDown={(e) => handlePressEnter(e)}
                                    />
                                    {red ? (
                                        <Button className={cx('send-btn')} onClick={() => sendComment()} red>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{ fontsize: '14px' }} />
                                        </Button>
                                    ) : (
                                        <Button className={cx('send-btn')} primary>
                                            {loadComment ? (
                                                <CircularProgress style={{ width: '16px', height: '16px' }} />
                                            ) : (
                                                <FontAwesomeIcon icon={faPaperPlane} style={{ fontsize: '14px' }} />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                        />
                        <LabelTextBox
                            name={'descriptionAdd'}
                            placeholder={'Mô tả'}
                            label={'Mô tả'}
                            selectedSize={screenWidth < 650 ? 'medium' : 'medium2'}
                            change={changeDiscription}
                            setChange={setChangeDiscription}
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

            {alertType === 'saveSuccess' && <ActionAlerts content={`Đã lưu pin`} />}
            {alertType === 'errorBoard' && <ActionAlerts severity="warning" content={`Chọn bảng bạn muốn lưu vào`} />}
            {alertType === 'errorSave' && <ActionAlerts severity="error" content={`Không thể lưu pin của chính bạn`} />}
            {alertType === 'create' && <ActionAlerts severity="success" content={`Đã thêm thành công`} />}
            {alertType === 'errorInfo' && <ActionAlerts severity="error" content={`Nhập đầy đủ thông tin`} />}
            {alertType === 'errorAdmin' && (
                <ActionAlerts severity="error" content={`Hãy đăng nhập tài khoản user để lưu pin`} />
            )}
            {showSelectReport && (
                <SelectReportOption
                    handleTurnOnSelectReport={handleTurnOnSelectReport}
                    pin={pin}
                    user={currentUser}
                    comment={reportedComment}
                />
            )}
        </div>
    );
}

export default DisplayPin;

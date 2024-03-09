import * as httpRequest from '../utils/httpRequest';

export const countAll = async () => {
    try {
        const res = await httpRequest.get(`comments/countAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getCommentByNotification = async (notificationId) => {
    try {
        const res = httpRequest.get(`comments/getByNotification/${notificationId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const percent7days = async () => {
    try {
        const res = await httpRequest.get(`comments/percent7days`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const countCommentByCreatedAt = async () => {
    try {
        const res = await httpRequest.get(`comments/countCommentByCreatedAt`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getByPinId = async (pin_id) => {
    try {
        const res = await httpRequest.get(`comments/pin_id/${pin_id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const del = async (comment) => {
    try {
        const res = await httpRequest.post(`comments/delete`, comment, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

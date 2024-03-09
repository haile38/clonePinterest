import * as httpRequest from '../utils/httpRequest';

export const getAllNotifications = async (userId) => {
    try {
        const res = await httpRequest.get(`notifications/user/${userId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getNewsHub = async (notificationId) => {
    try {
        const res = await httpRequest.get(`/news_hub/${notificationId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const notificationDeleted = async (userId) => {
    try {
        const res = await httpRequest.post(`notifications/deleted/${userId}`);
        console.log('Delete notification');
    } catch (error) {
        console.log(error);
    }
};

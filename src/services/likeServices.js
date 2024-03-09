import { ClickAwayListener } from '@mui/material';
import * as httpRequest from '../utils/httpRequest';

export const countAll = async () => {
    try {
        const res = await httpRequest.get(`likes/countAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getLikeByNotification = async (notificationId) => {
    try {
        const res = httpRequest.get(`likes/getByNotification/${notificationId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const percent7days = async () => {
    try {
        const res = await httpRequest.get(`likes/percent7days`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getLikeByPinId = async (PinId) => {
    try {
        const res = await httpRequest.get(`likes/getLikeByPinId/${PinId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const save = async (like) => {
    try {
        const res = await httpRequest.post(`likes/add`, like, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const del = async (like) => {
    try {
        const res = await httpRequest.post(`likes/delete`, like, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const countLikeByCreatedAt = async () => {
    try {
        const res = await httpRequest.get(`likes/countLikeByCreatedAt`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

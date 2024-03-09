import * as httpRequest from '../utils/httpRequest';

export const getPinByUserId = async (userId) => {
    try {
        const res = await httpRequest.get(`userSavePin/getPinByUser/${userId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getPinByUserIdAndBoardId = async (userId, boardId) => {
    try {
        const res = await httpRequest.get(`userSavePin/getPin/${userId}/${boardId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const save = async (userSavePin) => {
    try {
        const res = await httpRequest.post(`userSavePin/add`, userSavePin, {
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

export const getPinByBoardId = async (boardId) => {
    try {
        const res = await httpRequest.get(`userSavePin/boardId/${boardId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getPinsSavedByUserId = async (userId) => {
    try {
        const res = await httpRequest.get(`userSavePin/userId/${userId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const del = async (userSavePin) => {
    try {
        const res = await httpRequest.post(`userSavePin/delete`, userSavePin, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (userSavePin) => {
    try {
        const res = await httpRequest.put(`/userSavePin/edit`, userSavePin, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

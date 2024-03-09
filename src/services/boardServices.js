import * as httpRequest from '../utils/httpRequest';

export const getBoardByUsername = async (username) => {
    try {
        const res = await httpRequest.get(`boards/username/${username}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getBoardById = async (id) => {
    try {
        const res = await httpRequest.get(`boards/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (id, board) => {
    try {
        const res = await httpRequest.put(`boards/edit/${id}`, board, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (board) => {
    try {
        const res = await httpRequest.post(`boards/add`, board, {
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

export const deleteById = async (id) => {
    try {
        const res = await httpRequest.post(`boards/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

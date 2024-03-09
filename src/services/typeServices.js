import * as httpRequest from '../utils/httpRequest';

export const getAllType = async () => {
    try {
        const res = await httpRequest.get(`types/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getTypeById = async (id) => {
    try {
        const res = await httpRequest.get(`types/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (type) => {
    try {
        const res = await httpRequest.post(`types/add`, type, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteById = async (id) => {
    try {
        const res = await httpRequest.post(`types/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (id, type) => {
    try {
        const res = await httpRequest.put(`types/edit/${id}`, type, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

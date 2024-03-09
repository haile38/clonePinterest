import * as httpRequest from '../utils/httpRequest';

export const getFunctionById = async (id) => {
    try {
        const res = await httpRequest.get(`functions/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getAllFunction = async () => {
    try {
        const res = await httpRequest.get(`functions/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (type) => {
    try {
        const res = await httpRequest.post(`functions/add`, type, {
            headers: {
                'Content-Function': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteById = async (id) => {
    try {
        const res = await httpRequest.post(`functions/delete/${id}`, {
            headers: {
                'Content-Function': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (id, type) => {
    try {
        const res = await httpRequest.put(`functions/edit/${id}`, type, {
            headers: {
                'Content-Function': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

import * as httpRequest from '../utils/httpRequest';

export const getPermissionById = async (id) => {
    try {
        const res = await httpRequest.get(`permissions/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getAllPermission = async () => {
    try {
        const res = await httpRequest.get(`permissions/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (type) => {
    try {
        const res = await httpRequest.post(`permissions/add`, type, {
            headers: {
                'Content-Permission': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteById = async (id) => {
    try {
        const res = await httpRequest.post(`permissions/delete/${id}`, {
            headers: {
                'Content-Permission': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (id, type) => {
    try {
        const res = await httpRequest.put(`permissions/edit/${id}`, type, {
            headers: {
                'Content-Permission': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

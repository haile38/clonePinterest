import * as httpRequest from '../utils/httpRequest';

export const getByPermissionId = async (permissionId) => {
    try {
        const res = await httpRequest.get(`permission_function/permissionId/${permissionId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (permission_function) => {
    try {
        const res = await httpRequest.post(`permission_function/add`, permission_function, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteByPermission = async (permission) => {
    try {
        const res = await httpRequest.post('permission_function/deleteByPermission', permission, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

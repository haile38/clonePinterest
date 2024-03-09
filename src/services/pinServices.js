import * as httpRequest from '../utils/httpRequest';

export const getAllPins = async () => {
    try {
        const res = await httpRequest.get(`pins/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getPinsByUsername = async (username) => {
    try {
        const res = await httpRequest.get(`pins/username/${username}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getPinById = async (id) => {
    try {
        const res = await httpRequest.get(`pins/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (id, pin) => {
    try {
        const res = await httpRequest.put(`pins/edit/${id}`, pin, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const save = async (pin) => {
    try {
        const res = await httpRequest.post(`pins/add`, pin, {
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
        const res = await httpRequest.post(`pins/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const countAll = async () => {
    try {
        const res = await httpRequest.get(`pins/countAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const percent7days = async () => {
    try {
        const res = await httpRequest.get(`pins/percent7days`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const countPinByCreatedAt = async () => {
    try {
        const res = await httpRequest.get(`pins/countPinByCreatedAt`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

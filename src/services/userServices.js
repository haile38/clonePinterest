import * as httpRequest from '../utils/httpRequest';

export const getAllUser = async () => {
    try {
        const res = await httpRequest.get(`users/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getAllUserByEmail = async (email) => {
    try {
        const res = await httpRequest.get(`users/checkEmail?email=${email}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getUserByUsername = async (username) => {
    try {
        const res = await httpRequest.get(`users/username/${username}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getUserById = async (id) => {
    try {
        const res = await httpRequest.get(`users/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (user) => {
    try {
        const res = await httpRequest.post(`users/add`, user, {
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
        const res = await httpRequest.post(`users/delete/${id}`, {
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
        const res = await httpRequest.get(`users/countAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const percent7days = async () => {
    try {
        const res = await httpRequest.get(`users/percent7days`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getUserByPassword = async (password) => {
    try {
        const res = await httpRequest.get(`users/password/${password}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const login = async (email, password) => {
    try {
        const userlog = {
            email: email,
            password: password,
        };

        const res = await httpRequest.post(`users/login`, userlog, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const save = async (user) => {
    try {
        console.log(user);
        const res = await httpRequest.post(`users/register`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const changeUserInfo = async (id, userData) => {
    try {
        const res = await httpRequest.put(`users/id/${id}`, userData);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const changeUserBirthdate = async (id, updateBirthday) => {
    try {
        const res = await httpRequest.put(`users/id/${id}/birthdate`, updateBirthday);
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const changeUserPassword = async (id, currentPassword, newPassword) => {
    try {
        const res = await httpRequest.put(`users/id/${id}/password`, { currentPassword, newPassword });
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const changePrivate = async (id, currentState) => {
    try {
        const res = await httpRequest.put(`users/id/${id}/privateBool`, currentState, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.status;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const ChangeUserAvatar = async (id, base64String) => {
    try {
        const res = await httpRequest.put(`users/id/${id}/avatar`, { base64String });
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const countUserByCreatedAt = async () => {
    try {
        const res = await httpRequest.get(`users/countUserByCreatedAt`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

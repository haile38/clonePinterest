import * as httpRequest from '../utils/httpRequest';

export const getAllConversations = async () => {
    try {
        const res = await httpRequest.get(`conversations/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getById = async (id) => {
    try {
        const res = await httpRequest.get(`conversations/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const save = async (conversation) => {
    try {
        const res = await httpRequest.post(`conversations/add`, conversation, {
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
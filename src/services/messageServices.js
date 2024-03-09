import * as httpRequest from '../utils/httpRequest';

export const getAllMessage = async () => {
    try {
        const res = await httpRequest.get(`messages/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getMessageByConversationId = async (conversation_id) => {
    try {
        const res = await httpRequest.get(`messages/conversation_id/${conversation_id}`, {
            headers: {
                'Access-Control-Allow-Origin': true,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};



export const update = async (message) => {
    try {
        const res = await httpRequest.put(`messages/edit/${message.id}`, message, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const save = async (message) => {
    try {
        const res = await httpRequest.post(`messages/add`, message, {
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

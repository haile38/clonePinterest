import * as httpRequest from '../utils/httpRequest';

export const count = async () => {
    try {
        const res = await httpRequest.get(`report_comments/count`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getComment = async () => {
    try {
        const res = await httpRequest.get(`report_comments/get`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getCommentId = async (id) => {
    try {
        const res = await httpRequest.get(`report_comments/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const changeApprove = async (id, userRatify, approveState) => {
    try {
        const res = await httpRequest.put(`report_comments/id/${id}/${approveState}`, userRatify);
        return res.status;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const save = async (report) => {
    try {
        const res = await httpRequest.post(`report_comments/add`, report, {
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

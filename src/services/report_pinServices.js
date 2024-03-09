import * as httpRequest from '../utils/httpRequest';

export const count = async () => {
    try {
        const res = await httpRequest.get(`report_pins/count`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getAllReportPin = async () => {
    try {
        const res = await httpRequest.get(`report_pins/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const save = async (report) => {
    try {
        const res = await httpRequest.post(`report_pins/add`, report, {
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
export const getPin = async () => {
    try {
        const res = await httpRequest.get(`report_pins/get`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getPinId = async (id) => {
    try {
        const res = await httpRequest.get(`report_pins/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const changeApprove = async (id, userRatify, approveState) => {
    try {
        const res = await httpRequest.put(`report_pins/id/${id}/${approveState}`, userRatify);
        return res.status;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

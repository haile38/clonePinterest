import * as httpRequest from '../utils/httpRequest';

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
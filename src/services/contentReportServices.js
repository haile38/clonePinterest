import * as httpRequest from '../utils/httpRequest';

export const getContent_ReportById = async (id) => {
    try {
        const res = await httpRequest.get(`content_report/id/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getAllContent_Report = async () => {
    try {
        const res = await httpRequest.get(`content_report/getAll`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const add = async (type) => {
    try {
        const res = await httpRequest.post(`content_report/add`, type, {
            headers: {
                'Content-Content_Report': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteById = async (id) => {
    try {
        const res = await httpRequest.post(`content_report/delete/${id}`, {
            headers: {
                'Content-Content_Report': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (id, type) => {
    try {
        const res = await httpRequest.put(`content_report/edit/${id}`, type, {
            headers: {
                'Content-Content_Report': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

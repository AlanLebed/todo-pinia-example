import  Axios from 'Axios';

const url = 'http://127.0.0.1:5000/todo';

export async function getData() {
    try {
        const response = await  Axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateData(data: any) {
    try {
        const response = await  Axios.patch(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addData(data: any) {
    try {
        const response = await  Axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteData(id: String) {
    try {
        const response = await  Axios.delete(url, {data: {id: id}});
        return response.data;
    } catch (error) {
        throw error;
    }
}
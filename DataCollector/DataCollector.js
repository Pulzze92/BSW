import axios from 'axios';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.BINGX_API_KEY;
const API_SECRET = process.env.BINGX_SECRET_KEY;
const BASE_URL = process.env.BINGX_BASE_URL;
const HOST = process.env.HOST;

function getSignature(queryString, secretKey) {
    return CryptoJS.HmacSHA256(queryString, secretKey).toString(CryptoJS.enc.Hex);
}

async function makeRequest(endpoint, method = 'GET', params = {}) {
    const timestamp = Date.now();
    const recvWindow = 5000;

    let queryString = `timestamp=${timestamp}&recvWindow=${recvWindow}`;
    
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            queryString += `&${key}=${encodeURIComponent(value)}`;
        }
    }

    const signature = getSignature(queryString, API_SECRET);
    const url = `${BASE_URL}${endpoint}?${queryString}&signature=${signature}`;

    try {
        const response = await axios({
            method,
            url,
            headers: {
                'X-BX-APIKEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Пример использования: получение списка контрактов
async function getContracts() {
    try {
        const result = await makeRequest('/openApi/swap/v2/quote/contracts');
        console.log('Contracts:', result);
    } catch (error) {
        console.error('Failed to get contracts:', error);
    }
}

// Запуск примера
getContracts();
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
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getContracts() {
  try {
    const result = await makeRequest('/openApi/swap/v2/quote/contracts');
    console.log('Contracts:', result);
  } catch (error) {
    console.error('Failed to get contracts:', error);
  }
}

async function getCandleData(params) {
  //request: symbol, interval, startTime, endTime

  try {
    const result = await makeRequest('/openApi/swap/v2/quote/klines', 'GET', params);
    console.log('BTC:', result);
    // получаем такое:
    // data: {
    //     open: '57517.6',
    //     close: '59038.2',
    //     high: '59800.0',
    //     low: '57070.5',
    //     volume: '50036.84',
    //     time: 1723766400000
    //   }
  } catch (error) {
    console.error('Failed to get contracts:', error);
  }
}

async function get24HTickerChange() {
  const params = {
    symbol: 'BTC-USDT',
  };

  try {
    const result = await makeRequest('/openApi/swap/v2/quote/ticker', 'GET', params);
    console.log('BTC:', result);
    // получаем такое:
    //data: {
    //     symbol: 'BTC-USDT',
    //     priceChange: '1506.5',
    //     priceChangePercent: '2.62',
    //     lastPrice: '59038.1',
    //     lastQty: '0.0010',
    //     highPrice: '59800.0',
    //     lowPrice: '57070.5',
    //     volume: '52214.7232',
    //     quoteVolume: '3051965217.92',
    //     openPrice: '57531.6',
    //     openTime: 1723846418094,
    //     closeTime: 1723846668256,
    //     askPrice: '59038.3',
    //     askQty: '2.6146',
    //     bidPrice: '59034.9',
    //     bidQty: '0.0143'
    //   }
  } catch (error) {
    console.error('Failed to get contracts:', error);
  }
}

export { getContracts, getCandleData, get24HTickerChange };

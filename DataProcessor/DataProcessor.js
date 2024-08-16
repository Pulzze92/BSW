import { getCandleData, get24HTickerChange } from '../DataCollector/DataCollector.js';

const SYMBOL = 'BTC-USDT';

async function processData() {
  const hours = await recent24Hours(SYMBOL);
  const days = await recent3Days(SYMBOL);
  const weeks = await recent3Weeks(SYMBOL);
  const months = await recent3Months(SYMBOL);

  const currentDailyCandle = await currentDaily(SYMBOL);

  console.log('Current:', currentDaily);
  console.log('Hours:', hours);
  console.log('Days:', days);
  console.log('Weeks:', weeks);
  console.log('Months:', months);
}

async function currentDaily(symbol) {
  const params = {
    symbol: symbol,
  };

  return await get24HTickerChange(params);
}

async function recent24Hours(symbol) {
  const endTime = Date.now();
  const startTimeHour = endTime - 24 * 60 * 60 * 1000; // последние 24 часа

  const params = {
    symbol: symbol,
    interval: '1h',
    startTime: startTimeHour,
    endTime: endTime,
    limit: 24, // 24 свечи
  };

  return await getCandleData(params);
}

async function recent3Days(symbol) {
  const endTime = Date.now();
  const startTimeDay = endTime - 3 * 24 * 60 * 60 * 1000; // последние 3 дня

  const params = {
    symbol: symbol,
    interval: '1d',
    startTime: startTimeDay,
    endTime: endTime,
    limit: 3,
  };

  return await getCandleData(params);
}

async function recent3Weeks(symbol) {
  const endTime = Date.now();
  const startTimeWeek = endTime - 3 * 7 * 24 * 60 * 60 * 1000; // последние 3 недели

  const params = {
    symbol: symbol,
    interval: '1w',
    startTime: startTimeWeek,
    endTime: endTime,
    limit: 3,
  };

  return await getCandleData(params);
}

async function recent3Months(symbol) {
  const endTime = Date.now();
  const startTimeMonth = endTime - 3 * 30 * 24 * 60 * 60 * 1000; // примерно 3 месяца

  const params = {
    symbol: symbol,
    interval: '1M',
    startTime: startTimeMonth,
    endTime: endTime,
    limit: 3,
  };

  return await getCandleData(params);
}

processData().catch(console.error);

import axios from 'axios';
import { get, set } from './../../db';

import * as types from './types';

const map: types.HouseSentList = {};

const houseSentList: types.HouseSentList = {};
const getHouseList = async (rent_limit: number, deposit_limit: number) => {
    return axios.get<types.ZigbangHouseListResBody>(`https://apis.zigbang.com/v2/officetels?deposit_gteq=0&deposit_lteq=${deposit_limit}&domain=zigbang&lat_north=37.50112425130389&lat_south=37.4870365833023&lng_east=127.03571423729576&lng_west=127.01763893193973&needHasNoFiltered=true&rent_lteq=${rent_limit}&sales_type_in=%EC%9B%94%EC%84%B8`);
}

const getHouseDetails = async (houseIds: number[]) => {
    const body = { domain:"zigbang", withCoalition:true, item_ids:houseIds }
    return axios.post<types.ZigbangHouseDetailsResBody>('https://apis.zigbang.com/v2/items/list', body)
}

const calculateMostRecentHouse = async (houses: types.ZigbangHouseDetails[]) => {
    const mostRecentHouse = houses.sort((a, b) => b.reg_date.localeCompare(a.reg_date))[0];
    const itemId = String(mostRecentHouse.item_id);
    const item = await get(itemId);
    if (!item) {
        await set(itemId, mostRecentHouse.item_id);
        // map[String(mostRecentHouse.item_id)] = mostRecentHouse.item_id;
        return mostRecentHouse;
    }
    return null;
}

export const generateShareLink = (houseId: number) => `https://sp.zigbang.com/share/officetel/${houseId}`
export const getMostRecentHouse = async() => {
    const rentLimit = 100;
    const depositLimit = 3000;
    const houseIds = (await getHouseList(rentLimit, depositLimit)).data.sections.map((section) => section.item_ids).flat();
    const houseList = (await getHouseDetails(houseIds)).data.items
    return await calculateMostRecentHouse(houseList);
}
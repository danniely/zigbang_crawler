import axios from 'axios';

interface Section {
    type: "VIP" | "안심추천" | "안심일반" | "추천" | "일반",
    title: string,
    item_ids: number[],
}
interface ZigbangHouseListResBody {
    clusters: any[],
    sections: Section[],
    buildings: any[],
    agents: any[],
    hasNoFiltered: boolean,
}
export interface ZigbangHouseDetails {
    section_type: string,
    item_id: number,
    images_thumbnail: number,
    sales_type: string,
    sales_title: string,
    deposit: number,
    rent: number,
    size_m2: number,
    공급면적: {
       m2: number,
       p: string
    },
    전용면적: {
       m2: number,
       p: string,
    },
    계약면적: {
        m2: number,
        p: string,
     },
    room_type_title: string,
    floor: string,
    floor_string: string,
    building_floor: string,
    title: string,
    is_first_movein: boolean,
    room_type: string,
    address: string,
    random_location: {
       lat: number,
       lng: number,
    },
    is_zzim: false,
    status: true,
    service_type: string,
    tags: string[],
    address1: string,
    address2: null,
    address3: null,
    manage_cost: string,
    reg_date: string // "2022-08-05T18:08:33+09:00",
    is_new: boolean,
}
interface ZigbangHouseDetailsResBody {
    items: ZigbangHouseDetails[]
}

const houseSentList: Record<string, number> = {};
const getHouseList = async (rent_limit: number, deposit_limit: number) => {
    return axios.get<ZigbangHouseListResBody>(`https://apis.zigbang.com/v2/officetels?deposit_gteq=0&deposit_lteq=${deposit_limit}&domain=zigbang&lat_north=37.50112425130389&lat_south=37.4870365833023&lng_east=127.03571423729576&lng_west=127.01763893193973&needHasNoFiltered=true&rent_lteq=${rent_limit}&sales_type_in=%EC%9B%94%EC%84%B8`);
}

const getHouseDetails = async (houseIds: number[]) => {
    const body = { domain:"zigbang", withCoalition:true, item_ids:houseIds }
    return axios.post<ZigbangHouseDetailsResBody>('https://apis.zigbang.com/v2/items/list', body)
}

const calculateMostRecentHouse = (houses: ZigbangHouseDetails[]) => {
    const mostRecentHouse = houses.sort((a, b) => b.reg_date.localeCompare(a.reg_date))[0];
    if (!houseSentList[mostRecentHouse.item_id]) {
        // houseSentList[String(mostRecentHouse.item_id)] = mostRecentHouse.item_id;
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
    return calculateMostRecentHouse(houseList);
}
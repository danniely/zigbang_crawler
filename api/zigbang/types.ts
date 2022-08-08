export interface Section {
    type: "VIP" | "안심추천" | "안심일반" | "추천" | "일반",
    title: string,
    item_ids: number[],
}
export interface ZigbangHouseListResBody {
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
export interface ZigbangHouseDetailsResBody {
    items: ZigbangHouseDetails[]
}
export type HouseSentList = Record<string, number>;
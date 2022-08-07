import axios from 'axios';
import { exec } from 'child-process-async';

interface RefreshTokenReqBody {
    grant_type: string,
    client_id: string,
    refresh_token: string,
}
interface RefreshTokenResBody {
    token_type: 'bearer',
    access_token: string,
    expires_in: number,
    refresh_token?: string
}
interface Friend {
    id: number,
    uuid: string,
}
interface FriendListResBody {
    elements?: Friend[],
    total_count: number,
    before_url?: string,
    after_url?: string,
    favorite_count?: number,
}

const getAccessToken = () => process.env.ACCESS_TOKEN;

const setAccessToken = (accessToken: string) => {
    if (accessToken) {
        process.env.ACCESS_TOKEN = accessToken;
    }
};
const getRefreshToken = () => process.env.REFRESH_TOKEN;

const setRefreshToken = (refreshToken: string) => {
    if (refreshToken) {
        process.env.REFRESH_TOKEN = refreshToken;
    }
};

const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
});

const refreshAccessToken = async (): Promise<void> => {
    try {
        const res = JSON.parse((await exec(
            `curl -v -X POST "https://kauth.kakao.com/oauth/token" \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "grant_type=refresh_token" \
            -d "client_id=${process.env.KAKAO_REST_API_KEY}" \
            -d "refresh_token=${getRefreshToken()}"
        `)).stdout); // axios not working with POST with header 'application/x-www-form-urlencoded'
        setAccessToken(res.access_token);
        if (res.refresh_token) {
            setRefreshToken(res.refresh_token);
        }
    } catch (err) {
        console.log('generating access token failed');
        console.log('Error', JSON.stringify(err));
    }
}

const getKakaoApi = async <T>(endPoint: string, queryParam: any) => {
    try {
        return await axios.get<T>(endPoint, {
            headers: getConfig().headers,
        });
    } catch (err) {
        console.log('카카오톡 GET api를 받을수 없습니다');
        console.log('err: ' + JSON.stringify(err));
        await refreshAccessToken();
    }
}

const postKakaoApi = async (endPoint: string, body: any) => {
    try {
        const result = JSON.parse((await exec(
            `curl -v -X POST "${endPoint}" \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -H "Authorization: Bearer ${getAccessToken()}" \
            -d "template_object=${encodeURI(JSON.stringify(body))}
        `)).stdout); // axios not working with POST with header 'application/x-www-form-urlencoded'
    } catch (err) {
        console.log('카카오톡 POST api를 받을수 없습니다');
        console.log('err: ' + JSON.stringify(err));
        await refreshAccessToken();
    }
}

export const getFriendsList = async (): Promise<Friend[]> => {
    const body = {
        offset: 0,
        limit: 10,
    };
    const friendsList = (await getKakaoApi<FriendListResBody>('https://kapi.kakao.com/v1/api/talk/friends', body)).data.elements;

    return friendsList ?? [];
}

export const sendMessageToMySelf = async (text: string, link: string) => {
    const body = {
        object_type:"text",
        text,
        link:{ mobile_web_url: link }
    };
    await postKakaoApi('https://kapi.kakao.com/v2/api/talk/memo/default/send', body);
}

export const sendMessageToFriends = async (uuids: string[], text: string, link: string) => {
    const trimmedUuids = uuids.slice(0, 5); // max 5
    const body = {
        receiver_uuids: trimmedUuids,
        template_object:{
            object_type:"text",
            text,
            link:{ mobile_web_url: link }
        },
    };
    await postKakaoApi('https://kapi.kakao.com/v1/api/talk/friends/message/default/send', body);
}

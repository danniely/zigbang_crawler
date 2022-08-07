import * as kakaoApi from '../api/kakao';
import * as zigbangApi from '../api/zigbang'

export const eachBatch = async () => {
    const mostRecentHouse = await zigbangApi.getMostRecentHouse();
    if (mostRecentHouse) {
        const zigbangLink = zigbangApi.generateShareLink(mostRecentHouse.item_id);
        const friendsListIds = (await kakaoApi.getFriendsList()).map((friend) => friend.uuid);
        console.log('friend list: ' + JSON.stringify(friendsListIds));
        // kakaoApi.sendMessageToFriends(friendsListIds, mostRecentHouse.title, zigbangLink);
        await kakaoApi.sendMessageToMySelf(mostRecentHouse.title, zigbangLink);
        return mostRecentHouse;
    }
}
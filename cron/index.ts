import * as kakaoApi from '../api/kakao';
import * as zigbangApi from '../api/zigbang'
import cron from 'node-cron';

export const eachBatch = async () => {
    const mostRecentHouse = await zigbangApi.getMostRecentHouse();
    if (mostRecentHouse) {
        const zigbangLink = zigbangApi.generateShareLink(mostRecentHouse.item_id);
        const friendsListIds = (await kakaoApi.getFriendsList()).map((friend) => friend.uuid);
        // await kakaoApi.sendMessageToFriends(friendsListIds, mostRecentHouse, zigbangLink);
        await kakaoApi.sendMessageToMySelf(mostRecentHouse, zigbangLink);
        return mostRecentHouse;
    }
}

cron.schedule('*/5 * * * *', async () => {
    try {
        await eachBatch();
    } catch (err) {
        console.log(err);
    }
    console.log('batch run: ' + JSON.stringify(new Date()));
})
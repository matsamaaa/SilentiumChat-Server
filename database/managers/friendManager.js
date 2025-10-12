import Log from '../../utils/logs/logs.js';
import Friend from '../models/friendModel.js';

class FriendManager {

    static async addFriend(userId, friendId) {
        try {
            const friends = new Friend({
                userId: userId,
                friendId: friendId,
                users: [userId, friendId]
            });

            await friends.save();
            return friends;
        } catch (error) {
            throw new Error("Database error");
        }
    }

    static async getFriendsStatus(userId, friendId) {
        try {
            const friends = await Friend.findOne({
                users: {
                    $all: [userId, friendId],
                    $size: 2
                }
            })

            if (!friends) return null;

            return friends.status;
        } catch (error) {
            throw new Error("Database error");
        }
    }

    static async sendFriendRequest(from, to) {
        try {
            let friendship = await Friend.findOne({
                users: {
                    $all: [from, to],
                    $size: 2
                }
            });

            if (friendship) {
                if (friendship.status === 'rejected') {
                    friendship.status = 'pending';
                    await friendship.save();
                    return { message: "Friend request re-sent" };
                } else if (friendship.status === 'blocked') {
                    return { message: "Cannot send friend request to a blocked user" };
                } else if (friendship.status === 'pending') {
                    return { message: "Friend request already sent" };
                } else {
                    return { message: "Users are already friends" };
                }
            }

            friendship = await this.addFriend(from, to);
            return { message: "Friend request sent" };
        } catch (error) {
            Log.Error("Error sending friend request:", error);
            throw new Error("Database error");
        }
    }

}

export default FriendManager;

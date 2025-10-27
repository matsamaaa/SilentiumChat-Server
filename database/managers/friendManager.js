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

            return friends;
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
                    if (friendship.userId === to) {
                        friendship.userId = from;
                        friendship.friendId = to;
                    }
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

    static async acceptFriendRequest(userId, friendId) {
        try {
            const friendship = await Friend.findOne({
                users: {
                    $all: [userId, friendId],
                    $size: 2
                },
                status: 'pending'
            });
            if (!friendship) {
                throw new Error("No pending friend request found");
            }

            friendship.status = 'accepted';
            await friendship.save();
            return { message: "Friend request accepted" };
        } catch (error) {
            Log.Error("Error accepting friend request:", error);
            throw new Error("Database error");
        }
    }

    static async refuseFriendRequest(userId, friendId) {
        try {
            const friendship = await Friend.findOne({
                users: {
                    $all: [userId, friendId],
                    $size: 2
                },
                status: 'pending'
            });
            if (!friendship) {
                throw new Error("No pending friend request found");
            }

            friendship.status = 'rejected';
            await friendship.save();
            return { message: "Friend request refused" };
        } catch (error) {
            Log.Error("Error refusing friend request:", error);
            throw new Error("Database error");
        }
    }

    static async blockUser(userId, friendId) {
        try {
            let friendship = await Friend.findOne({
                users: {
                    $all: [userId, friendId],
                    $size: 2
                }
            });
            if (friendship) {
                if (friendship.isBlocked.includes(friendId)) {
                    throw new Error("User is already blocked");
                }
                friendship.status = 'blocked';
                friendship.isBlocked.push(friendId);

                await friendship.save();
                return { message: "User blocked successfully" };
            }

            friendship = await this.addFriend(userId, friendId);
            friendship.status = 'blocked';
            friendship.isBlocked.push(friendId);
            await friendship.save();
            return { message: "User blocked successfully" };
        } catch (error) {
            Log.Error("Error blocking user:", error);
            throw new Error("Error blocking user");
        }
    }

    static async unblockUser(userId, friendId) {
        try {
            const friendship = await Friend.findOne({
                users: {
                    $all: [userId, friendId],
                    $size: 2
                },
                status: 'blocked'
            });
            if (!friendship) {
                throw new Error("No blocked user found");
            }

            friendship.isBlocked = friendship.isBlocked.filter(id => id !== friendId);
            if (friendship.isBlocked.length < 1) {
                friendship.status = 'rejected';
            }
            await friendship.save();
            return { message: "User unblocked successfully" };
        } catch (error) {
            Log.Error("Error unblocking user:", error);
            throw new Error("Database error");
        }
    }

    static async cancelFriendRequest(userId, friendId) {
        try {
            const friendship = await Friend.findOne({
                users: {
                    $all: [userId, friendId],
                    $size: 2
                },
                status: 'pending'
            });
            if (!friendship) {
                throw new Error("No pending friend request found");
            }

            friendship.status = 'rejected';
            await friendship.save();
            return { message: "Friend request cancelled" };
        } catch (error) {
            Log.Error("Error cancelling friend request:", error);
            throw new Error("Database error");
        }
    }

}

export default FriendManager;

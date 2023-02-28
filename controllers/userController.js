const User = require('../models/User');
const Thought = require('../models/Thought')

module.exports = {
    // Find all users.
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // Find a single user by ID.
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that userId' })
                    : res.json({ user })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user by ID and remove their thoughts.
    deleteUser(req, res) {
        User.deleteOne({ _id: req.params.userId })
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // Update a user by ID.
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            req.body,
            { new: true }
        )
            .then((updated) => res.json(updated))
            .catch((err) => res.status(500).json(err));
    },
    // Add a friend to a user's friend list.
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { "friends": req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that userId' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete a friend from a user's friend list.
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { "friends": req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that userId' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};

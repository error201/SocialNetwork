const { Thought, User, Reaction } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that thoughtId' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create a new thought. Push the thoughtId to the user's thoughts array.
    createThought(req, res) {
        let userId = req.body.userId;
        Thought.create(req.body)
            .then((data) =>
                User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { "thoughts": data._id } },
                    { runValidators: true, new: true }
                ).then((user) =>
                    !user
                        ? res.status(404).json({ message: 'No user with that userId' })
                        : res.json(user)
                )
            )
            .catch((err) => res.status(500).json(err));

    },
    // Delete a thought by ID. Delete thought from users' thoughts array.
    deleteThought(req, res) {
        let thoughtId = req.params.thoughtId;
        Thought.deleteOne({ _id: thoughtId })
            .then((data) =>
                User.findOneAndUpdate(
                    { thoughts: thoughtId },
                    { $pull: { "thoughts": thoughtId } },
                    { runValidators: true, new: true }
                ).then((user) =>
                    !user
                        ? res.status(404).json({ message: 'No user with that userId' })
                        : res.json(user)
                )
            )
            .catch((err) => res.status(500).json(err));
    },
    // Update a thought by ID.
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body,
            { new: true }
        )
            .then((updated) => res.json(updated))
            .catch((err) => res.status(500).json(err));
    },
};

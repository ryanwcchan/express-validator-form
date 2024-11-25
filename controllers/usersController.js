const usersStorage = require('../storages/usersStorage')
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters."
const lengthErr = "must be between 1 and 10 characters."

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body("email").trim()
        .isEmail().withMessage("Email must be valid"),
    body("age").trim()
        .optional({ checkFalsy: true })
        .isInt({ min: 18, max: 120 }).withMessage("Age must be between 18 and 120"),
    body("bio").trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 200 }).withMessage("Bio must be between 1 and 200 characters.")
]

exports.usersListGet = (req, res) => {
    res.render("index", {
        title: "Users list",
        users: usersStorage.getUsers()
    })
}

exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create user"
    })
}

exports.usersCreatePost = [validateUser, (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).render("createUser", {
                title: "Create user",
                errors: errors.array(),
            })
        }
        const { firstName, lastName, email, age, bio } = req.body
        usersStorage.addUser({ firstName, lastName, email, age, bio });
        res.redirect("/");
    }
]

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };
  
exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
            title: "Update user",
            user: user,
            errors: errors.array(),
        });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
        res.redirect("/");
    }
];

exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
};

exports.searchUsers = (req, res) => {
    const search = req.query.search || ""
    const users = usersStorage.getUsers()
    console.log(users)
    console.log("Search query:", search);
    const filteredUsers = users.filter(user => 
        (user.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.lastName?.toLowerCase() || "").includes(search.toLowerCase())
    );
    res.render("userSearch", {
        title: "Users Search",
        resultTitle: `Search results for "${search}"`,
        users: filteredUsers,
        search
    })
}
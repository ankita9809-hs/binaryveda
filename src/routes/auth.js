// Global imports
const router = require("express").Router();

const auth = require("../controllers/userController");

router.post("/signin", auth.signin);
router.post("/login", auth.login);

module.exports = router;

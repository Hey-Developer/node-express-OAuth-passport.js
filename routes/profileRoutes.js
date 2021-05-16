const router = require("express").Router();
const { ensureAuth } = require("../middlewares/authMiddlewares");

router.get("/", ensureAuth, (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

module.exports = router;

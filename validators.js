const { body, validationResult } = require("express-validator");

const validateMovie = [
  body("title").isLength({ max: 255 }),
  body("direcor").isLength({ max: 255 }),
  body("year").isLength({ max: 255 }),
  body("color").isLength({ max: 255 }),
  body("duration").isInt(),
];

const validateUser = [
  body("firstname").isLength({ max: 255 }),
  body("lastname").isLength({ max: 255 }),
  body("email").isEmail(),
  body("city").isLength({ max: 255 }),
  body("language").isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationResult: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = {
  validateMovie,
  validateUser,
};

const mongoose = require("mongoose");
const router = require("express").Router();

const Category = require("../models/Category.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//  Category /api/categories  -  Creates a new category
router.post("/", isAuthenticated, (req, res, next) => {
  const { name } = req.body;

  Category.create({ name })
    .then((response) => res.status(201).json(response))
    .catch((err) => res.json(err));
});

//  GET /api/categories -  Retrieves all of the categories
router.get("/", (req, res, next) => {
  Category.find()

    .then((allcategories) => res.json(allcategories))
    .catch((err) => res.json(err));
});

module.exports = router;

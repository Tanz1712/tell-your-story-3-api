const mongoose = require("mongoose");
const router = require("express").Router();

const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Category = require("../models/Category.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//  POST /api/posts  -  Creates a new post
router.post(
  "/",
  isAuthenticated,
  fileUploader.single("photo"),
  (req, res, next) => {
    // console.log("file is: ", req.file)

    /* if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }*/

    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
    const { title, content, photo, author, categories } = req.body; // photo,
    console.log(req.body);
    Post.create({
      title,
      content,
      //  photo: req.file.path,
      author: req.payload._id,
      categories,
    })
      .then((response) => res.status(201).json(response))
      .catch((err) => res.json(err));
  }
);

//  GET /api/posts -  Retrieves all of the posts
router.get("/", (req, res, next) => {
  Post.find()
    .populate("author")
    .populate("categories")
    .then((allposts) => res.json(allposts))
    .catch((err) => res.json(err));
}); // Also this route works

//GET ALL POSTS
/*router.get("/", async (req, res) => {
  const author = req.query.name; // /?name="(tan) id"
  const catName = req.query.cat; // /?cat="(gym) id"
  console.log(author);
  try {
    let posts;
    if (author) {
      posts = await Post.find({ author: author });
    } else if (catName) {
      posts = await Post.find({ categories: catName }).populate("categories");
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});*/

//  GET /api/posts/:postId -  Retrieves a specific post by id
//router.get("/:postId", isAuthenticated, (req, res, next) => {
router.get("/:postId", isAuthenticated, (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Post.findById(postId)
    .populate("author")

    .then((post) => res.status(200).json(post))
    .catch((error) => res.json(error));
});

// PUT  /api/posts/:postId  -  Updates a specific post by id

router.put(
  "/:postId",
  isAuthenticated,
  fileUploader.single("photo"),
  (req, res, next) => {
    const { postId } = req.params;

    const { title, content, existingPhoto, author, categories } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    if (req.file) {
      photo: req.file.path;
    } else {
      photo = existingPhoto;
    }

    // if (post.author == req.payload._id)
    Post.findByIdAndUpdate(
      postId,
      { title, content },
      // { title, content, photo, author, categories },
      { new: true }
    )
      .then((updatedpost) => res.json(updatedpost))
      .catch((error) => res.json(error));
  }
);

//UPDATE POST
/*router.put(
  "/:postId",
  isAuthenticated,
  fileUploader.single("photo"),
  async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      const { title, content, existingPhoto, author, categories } = req.body;
      console.log(author);
      console.log(req.payload._id);
      if (post.author == req.payload._id) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can update only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);*/

// DELETE  /api/posts/:postId  -  Deletes a specific post by id
//isAuthenticated,
router.delete("/:postId", isAuthenticated, (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // if (post.author == req.payload._id)
  Post.findByIdAndRemove(postId)
    .then(() =>
      res.json({
        message: `post with ${postId} is successfully deleted.`,
      })
    )
    .catch((error) => res.json(error));
});

/*router.delete("/:postId", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (post.author == req.payload._id) {
      await post.delete();
      res
        .status(200)
        .json({ message: `post with ${postId} is successfully deleted` });
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});*/

module.exports = router;

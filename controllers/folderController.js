const asyncHandeler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.folder_post = [
  body("folder")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name cannot be blank"),
  body("folder").custom(
    asyncHandeler(async (value, { req }) => {
      let folders = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          folders: true,
        },
      });

      folders = folders.folders;
      req.folders = folders;

      const match = folders.find((folder) => folder.name === value);
      if (match) {
        throw new Error("Folder name already exists");
      }
    })
  ),
  asyncHandeler(async (req, res, next) => {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      console.log(errors);
      return res.render("index", { errors, folders: req.folders });
    }

    // CHECK BELOW
    console.log(req.user);
    console.log(req.body.folder);
    await prisma.folder.create({
      data: {
        name: req.body.folder,
        userId: req.user.id,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        folders: true,
      },
    });

    console.log(user.folders);
    res.send("New folder created!");
  }),
];

exports.single_folder_get = asyncHandeler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (folder.userId === req.user.id) {
    res.send(`You are authorized to view folder - ${folder.name}`);
  } else {
    res.send("You are not authorized to view this folder");
  }
});

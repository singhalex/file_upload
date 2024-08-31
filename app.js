const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("./utils/passport");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const folderRouter = require("./routes/folder");
const fileRouter = require("./routes/file");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Initialize the session middleware
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Store session data in the db
    store: new PrismaSessionStore(new PrismaClient(), {
      // drops sessions after they expire
      checkPeriod: 2 * 60 * 1000, // ms
      // sets the record id to the session id
      dbRecordIdIsSessionId: true,
      // do not create a record id
      dbRecordIdFunction: undefined,
    }),
  })
);

// Use passport to authenticate the session
app.use(passport.session());

// If user logged in, pass the user to the locals object
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/folder", folderRouter);
app.use("/file", fileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { currentUser: req.user });
});

module.exports = app;

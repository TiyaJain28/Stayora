const User = require("../models/user");

// Render pages
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

// Signup
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Stayora!");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Login
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back! You are logged in!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
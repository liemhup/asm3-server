exports.isAuth = (req, res, next) => {
  if (req.session.isAuth === true) next();
  else res.end();
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') next();
    else res.status(401).end();
  } else res.status(401).end();
};

exports.isStaff = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.role === 'staff' || req.session.user.role === 'admin')
      next();
    else res.status(401).end();
  } else res.status(401).end();
};

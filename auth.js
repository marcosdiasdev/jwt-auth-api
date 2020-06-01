require('dotenv-safe').config();
const privateKey = process.env.SECRET;
const jwt = require('jsonwebtoken');

exports.verifyAuth = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if(!token) {
    return res.status(401).send({ auth: false, message: "No token provided"});
  }

  jwt.verify(token, privateKey, function(err, decoded) {
    if(err) {
      return res.status(401).send({ auth: false, message: "Failed to authenticate token"});
    }
    req.user = decoded.user;
    next();
  });
}

exports.authenticate = (req, res) => {
  if(req.body.user == 'admin' && req.body.pwd == 'admin') {
    const payload = {
      "user": "admin",
      "uid": "1"
    };
    const token = jwt.sign(payload, privateKey, { expiresIn: "60 minutes" });
    
    return res.send({ auth: true, message : 'Auth successful', token: token});

  } else {
    res.status(401);
    return res.send({ auth: false, message : 'Invalid credentials'});
  }
}
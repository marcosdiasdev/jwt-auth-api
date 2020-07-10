require('dotenv-safe').config();
const privateKey = process.env.SECRET;
const jwt = require('jsonwebtoken');

const cookieConfig = {
  httpOnly: true, // to disable accessing cookie via client side js
  //secure: true, // to force https (if you use it)
  signed: true // if you use the secret with cookieParser
};

exports.authenticate = (req, res) => {
  if(req.body.user == 'admin' && req.body.pwd == 'admin') {
    const payload = {
      "user": "admin",
      "uid": "1"
    };
    const token = jwt.sign(payload, privateKey, { expiresIn: "60 minutes" });
    res.cookie('token', token, cookieConfig);
    return res.send({ auth: true, message : 'Auth successful' });

  } else {
    res.status(401);
    return res.send({ auth: false, message : 'Invalid credentials'});
  }
}

exports.authorize = (req, res, next) => {
  
  const signedCookies = req.signedCookies;
  const token = signedCookies.token;
  console.log('signed-cookies:', signedCookies); 

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
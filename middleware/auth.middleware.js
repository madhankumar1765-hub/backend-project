// // const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//   const authorization = req.headers.authorization;

//   const [schema, token] = authorization ? authorization.split(" ") : [];

//   // Check Authorization Header
//   if (schema !== "Bearer" || !token) {
//     return res.status(401).json({
//       message: "Authorization token is required",
//     });
//   }

//   const secretKey = process.env.JWT_SECRET;

//   if (!secretKey) {
//     return next(new Error("JWT_SECRET is not defined"));
//   }

//   try {
//     req.user = jwt.verify(token, secretKey);
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Token is expired or invalid",
//     });
//   }
// }

// module.exports = authMiddleware;
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Authorization token is required",
    });
  }

  const [schema, token] = authorization.split(" ");

  if (schema !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    return res.status(500).json({
      message: "JWT_SECRET is not defined",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is expired or invalid",
    });
  }
}

module.exports = authMiddleware;
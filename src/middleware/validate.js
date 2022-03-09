const checkProductData = async (req, res, next) => {
  const errors = [];

  for (const key in req.body) {
    if (!req.body[key]) {
      errors.push(`Please Fill ${key} Field.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({msg: errors});
  }

  next();
};

module.exports = {checkProductData};

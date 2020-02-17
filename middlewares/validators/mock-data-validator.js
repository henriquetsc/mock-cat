let MockDataValidator = (req, res, next) => {
  let body = req.body;
    let group = body.group;
    if (group === undefined) res.send(400);
    next();
}

module.exports = MockDataValidator;
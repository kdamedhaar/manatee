/**
 * error handling middleware module
 */

const handleErrors = (error, req, res, next) => {
  if (error) {
    let request = Object.keys(req.query).length === 0 ? req.body : req.query;
    let resp = Object.assign({}, request);
    let message = error.message ? error.message : error;
    resp.success = false;
    resp.message = message;
    console.error(error);
    res.status(500).json(resp);
    next();
  }
};

export { handleErrors };

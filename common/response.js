const resForm = {
  successRes: (res, payload, statusCode = 200) => {
    return res.status(statusCode).json({ success: true, payload });
  },
};

export default resForm;

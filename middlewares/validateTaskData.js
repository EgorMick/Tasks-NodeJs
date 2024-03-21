export const validateTaskData = (req, res, next) => {
    const { description, status } = req.body;
    
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ message: "Invalid or missing description" });
    }

    if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Invalid or missing status" });
      }
    next();
  };
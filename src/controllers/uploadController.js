import { uploadMedias } from "../middlewares/uploadMedias.js";

export const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const result = await uploadMedias(req.file);
    return res.status(200).json({
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const results = await uploadMedias(req.files);
    return res.status(200).json({
      message: "Files uploaded successfully",
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

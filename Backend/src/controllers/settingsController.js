import SystemSettings from "../models/SystemSettings.js";

export const getSettings = async (req, res) => {
  const settings = await SystemSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { new: true, upsert: true }
  );
  res.json(settings);
};

export const updateSettings = async (req, res) => {
  const settings = await SystemSettings.findOneAndUpdate(
    { key: "default" },
    { ...req.body, key: "default" },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(settings);
};

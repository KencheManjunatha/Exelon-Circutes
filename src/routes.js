const express = require("express");
const City = require("./models");

const router = express.Router();

// Add City
router.post("/", async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json({ message: "City added successfully", city });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update City
router.put("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const updatedCity = await City.findOneAndUpdate({ name }, req.body, {
      new: true,
    });
    if (!updatedCity)
      return res.status(404).json({ message: "City not found" });
    res.json({ message: "City updated successfully", city: updatedCity });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete City
router.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const deletedCity = await City.findOneAndDelete({ name });
    if (!deletedCity)
      return res.status(404).json({ message: "City not found" });
    res.json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Cities
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filter = {},
      sort = "name",
      search = "",
      projection = "",
    } = req.query;

    const query = {
      ...filter,
      $or: [{ name: new RegExp(search, "i") }],
    };

    const cities = await City.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select(projection);

    res.json(cities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

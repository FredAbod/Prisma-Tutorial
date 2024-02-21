const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Prisma, Express, and PSQL Tutorial");
});

// Create a blog
app.post("/post", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Please input Title and Content" });
    }

    const blog = await prisma.post.create({
      data: { title, content },
    });

    return res
      .status(201)
      .json({ message: "Blog created successfully", data: blog });
  } catch (error) {
    return res.status(500).json({ message: "Error creating blog" });
  }
});

// Get all blogs
app.get("/posts", async (req, res) => {
  try {
    const blogs = await prisma.post.findMany();
    return res.status(201).json({ data: blogs.length, blogs });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching blogs" });
  }
});

// Get a single blog by title
app.get("/get", async (req, res) => {
    const { title } = req.query;
    try {
      const blog = await prisma.post.findFirst({
        where: { title }
      });
      if (blog) {
        return res.status(200).json(blog);
      } else {
        return res.status(404).json({ message: "Blog not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error fetching blog" });
    }
  });
  

// Update a blog by id
app.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const updatedBlog = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    return res.json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating blog" });
  }
});

// Delete a blog by id
app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting blog" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

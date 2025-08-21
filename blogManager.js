// blogManager.js
const EventEmitter = require('events');
const fs = require('fs').promises;
const fscb = require('fs');
const path = require('path');

class BlogManager extends EventEmitter {
  constructor() {
    super();
    this.blogsDir = path.join(__dirname, 'blogs');
    this.logsDir = path.join(__dirname, 'logs');
    this.activityLog = path.join(this.logsDir, 'activity.log');
    fscb.mkdirSync(this.blogsDir, { recursive: true });
    fscb.mkdirSync(this.logsDir, { recursive: true });

    this.on('blogCreated', blog => this.logActivity(`CREATED ${blog.id} - ${blog.title}`));
    this.on('blogRead', blog => this.logActivity(`READ ${blog.id} - ${blog.title}`));
    this.on('blogDeleted', id => this.logActivity(`DELETED ${id}`));
  }

  _blogPathById(id) {
    return path.join(this.blogsDir, `blog-${id}.json`);
  }

  async createBlog(title, content) {
    const id = Date.now().toString();
    const date = new Date().toISOString().slice(0, 10);
    const blog = { id, title, content, date, readCount: 0 };
    await fs.writeFile(this._blogPathById(id), JSON.stringify(blog, null, 2), 'utf8');
    this.emit('blogCreated', blog);
    return blog;
  }

  async readBlog(id) {
    try {
      const filePath = this._blogPathById(id);
      const data = await fs.readFile(filePath, 'utf8');
      const blog = JSON.parse(data);
      blog.readCount = (blog.readCount || 0) + 1;
      await fs.writeFile(filePath, JSON.stringify(blog, null, 2), 'utf8');
      this.emit('blogRead', blog);
      return blog;
    } catch {
      return null;
    }
  }

  async getAllBlogs() {
    const files = await fs.readdir(this.blogsDir);
    const blogs = [];
    for (const file of files) {
      if (path.extname(file) === '.json') {
        const data = await fs.readFile(path.join(this.blogsDir, file), 'utf8');
        blogs.push(JSON.parse(data));
      }
    }
    return blogs;
  }

  async logActivity(message) {
    const line = `[${new Date().toISOString()}] ${message}
`;
    await fs.appendFile(this.activityLog, line, 'utf8');
  }
}

module.exports = BlogManager;

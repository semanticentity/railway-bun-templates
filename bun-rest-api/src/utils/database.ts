import { User, Post, Comment, CreateUserRequest, CreatePostRequest, CreateCommentRequest } from '../types';
import { generateId } from './index';

// In-memory database simulation
class InMemoryDatabase {
  private users: User[] = [];
  private posts: Post[] = [];
  private comments: Comment[] = [];

  constructor() {
    this.seedDatabase();
  }

  // Seed with initial data
  private seedDatabase() {
    // Create sample users
    const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    sampleUsers.forEach(userData => {
      this.users.push({
        id: generateId(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    // Create sample posts
    const samplePosts: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { title: 'Welcome to the API', content: 'This is the first post in our API!', authorId: this.users[0].id },
      { title: 'Getting Started', content: 'Learn how to use this REST API effectively.', authorId: this.users[1].id },
      { title: 'Advanced Features', content: 'Discover the advanced features of our API.', authorId: this.users[2].id },
    ];

    samplePosts.forEach(postData => {
      this.posts.push({
        id: generateId(),
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    // Create sample comments
    const sampleComments: Omit<Comment, 'id' | 'createdAt'>[] = [
      { content: 'Great post!', postId: this.posts[0].id, authorId: this.users[1].id },
      { content: 'Very helpful, thanks!', postId: this.posts[0].id, authorId: this.users[2].id },
      { content: 'Looking forward to more content like this.', postId: this.posts[1].id, authorId: this.users[0].id },
    ];

    sampleComments.forEach(commentData => {
      this.comments.push({
        id: generateId(),
        ...commentData,
        createdAt: new Date().toISOString(),
      });
    });
  }

  // User operations
  async getUsers(): Promise<User[]> {
    await this.delay();
    return [...this.users];
  }

  async getUserById(id: string): Promise<User | null> {
    await this.delay();
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.delay();
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    await this.delay();
    
    // Check if email already exists
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    await this.delay();
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    // Check if email is being updated and already exists
    if (userData.email && userData.email !== this.users[userIndex].email) {
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.delay();
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    // Delete user's posts and comments
    this.posts = this.posts.filter(post => post.authorId !== id);
    this.comments = this.comments.filter(comment => comment.authorId !== id);
    
    this.users.splice(userIndex, 1);
    return true;
  }

  // Post operations
  async getPosts(): Promise<Post[]> {
    await this.delay();
    return [...this.posts];
  }

  async getPostById(id: string): Promise<Post | null> {
    await this.delay();
    return this.posts.find(post => post.id === id) || null;
  }

  async getPostsByAuthor(authorId: string): Promise<Post[]> {
    await this.delay();
    return this.posts.filter(post => post.authorId === authorId);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    await this.delay();
    
    // Validate that author exists
    const author = await this.getUserById(postData.authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    const newPost: Post = {
      id: generateId(),
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.posts.push(newPost);
    return newPost;
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
    await this.delay();
    
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return null;
    }

    // If authorId is being updated, validate that the new author exists
    if (postData.authorId && postData.authorId !== this.posts[postIndex].authorId) {
      const author = await this.getUserById(postData.authorId);
      if (!author) {
        throw new Error('Author not found');
      }
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    };

    return this.posts[postIndex];
  }

  async deletePost(id: string): Promise<boolean> {
    await this.delay();
    
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return false;
    }

    // Delete post's comments
    this.comments = this.comments.filter(comment => comment.postId !== id);
    
    this.posts.splice(postIndex, 1);
    return true;
  }

  // Comment operations
  async getComments(): Promise<Comment[]> {
    await this.delay();
    return [...this.comments];
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    await this.delay();
    return this.comments.filter(comment => comment.postId === postId);
  }

  async getCommentsByAuthor(authorId: string): Promise<Comment[]> {
    await this.delay();
    return this.comments.filter(comment => comment.authorId === authorId);
  }

  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    await this.delay();
    
    // Validate that post exists
    const post = await this.getPostById(commentData.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Validate that author exists
    const author = await this.getUserById(commentData.authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    const newComment: Comment = {
      id: generateId(),
      ...commentData,
      createdAt: new Date().toISOString(),
    };

    this.comments.push(newComment);
    return newComment;
  }

  async deleteComment(id: string): Promise<boolean> {
    await this.delay();
    
    const commentIndex = this.comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      return false;
    }

    this.comments.splice(commentIndex, 1);
    return true;
  }

  // Utility to simulate database delay
  private async delay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  }

  // Get database statistics
  async getStats() {
    await this.delay();
    return {
      users: this.users.length,
      posts: this.posts.length,
      comments: this.comments.length,
    };
  }

  // Reset database (for testing)
  async reset() {
    this.users = [];
    this.posts = [];
    this.comments = [];
    this.seedDatabase();
  }
}

// Export singleton instance
export const database = new InMemoryDatabase();

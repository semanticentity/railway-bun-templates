import { database } from '../utils/database';
import { successResponse, errorResponse, validateRequired, parseQueryParams, sortArray, paginate } from '../utils';
import { Post, CreatePostRequest, UpdatePostRequest } from '../types';

export class PostRoutes {
  // GET /api/posts - Get all posts with pagination
  async getPosts(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const { page, limit, sortBy, sortOrder } = parseQueryParams(url);
      
      let posts = await database.getPosts();
      
      // Apply sorting
      posts = sortArray(posts, sortBy, sortOrder);
      
      // Apply pagination
      const paginatedPosts = paginate(posts, page, limit);
      
      return new Response(JSON.stringify(successResponse(paginatedPosts)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch posts', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/posts/:id - Get post by ID
  async getPostById(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('Post ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const post = await database.getPostById(id);
      
      if (!post) {
        return new Response(
          JSON.stringify(errorResponse('Post not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(post)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch post', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // POST /api/posts - Create a new post
  async createPost(request: Request): Promise<Response> {
    try {
      const body = await request.json() as CreatePostRequest;
      
      // Validate required fields
      const validationErrors = validateRequired(body, ['title', 'content', 'authorId']);
      if (validationErrors.length > 0) {
        return new Response(
          JSON.stringify(errorResponse('Validation failed', validationErrors.join(', '))),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const post = await database.createPost(body);
      
      return new Response(JSON.stringify(successResponse(post, 'Post created successfully')), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      
      return new Response(
        JSON.stringify(errorResponse('Failed to create post', errorMessage)),
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // PUT /api/posts/:id - Update a post
  async updatePost(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      const body = await request.json() as UpdatePostRequest;
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('Post ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const post = await database.updatePost(id, body);
      
      if (!post) {
        return new Response(
          JSON.stringify(errorResponse('Post not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(post, 'Post updated successfully')), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      
      return new Response(
        JSON.stringify(errorResponse('Failed to update post', errorMessage)),
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // DELETE /api/posts/:id - Delete a post
  async deletePost(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('Post ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const deleted = await database.deletePost(id);
      
      if (!deleted) {
        return new Response(
          JSON.stringify(errorResponse('Post not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(null, 'Post deleted successfully')), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to delete post', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/posts/:id/comments - Get comments for a post
  async getPostComments(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const postId = pathParts[pathParts.length - 2]; // Get post ID from /api/posts/:id/comments
      
      if (!postId) {
        return new Response(
          JSON.stringify(errorResponse('Post ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if post exists
      const post = await database.getPostById(postId);
      if (!post) {
        return new Response(
          JSON.stringify(errorResponse('Post not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const comments = await database.getCommentsByPost(postId);
      
      return new Response(JSON.stringify(successResponse(comments)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch post comments', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}

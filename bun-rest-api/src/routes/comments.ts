import { database } from '../utils/database';
import { successResponse, errorResponse, validateRequired, parseQueryParams, sortArray, paginate } from '../utils';
import { Comment, CreateCommentRequest } from '../types';

export class CommentRoutes {
  // GET /api/comments - Get all comments with pagination
  async getComments(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const { page, limit, sortBy, sortOrder } = parseQueryParams(url);
      
      let comments = await database.getComments();
      
      // Apply sorting
      comments = sortArray(comments, sortBy, sortOrder);
      
      // Apply pagination
      const paginatedComments = paginate(comments, page, limit);
      
      return new Response(JSON.stringify(successResponse(paginatedComments)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch comments', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/comments/:id - Get comment by ID
  async getCommentById(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('Comment ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const comments = await database.getComments();
      const comment = comments.find(c => c.id === id);
      
      if (!comment) {
        return new Response(
          JSON.stringify(errorResponse('Comment not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(comment)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch comment', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // POST /api/comments - Create a new comment
  async createComment(request: Request): Promise<Response> {
    try {
      const body = await request.json() as CreateCommentRequest;
      
      // Validate required fields
      const validationErrors = validateRequired(body, ['content', 'postId', 'authorId']);
      if (validationErrors.length > 0) {
        return new Response(
          JSON.stringify(errorResponse('Validation failed', validationErrors.join(', '))),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const comment = await database.createComment(body);
      
      return new Response(JSON.stringify(successResponse(comment, 'Comment created successfully')), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      
      return new Response(
        JSON.stringify(errorResponse('Failed to create comment', errorMessage)),
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // DELETE /api/comments/:id - Delete a comment
  async deleteComment(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('Comment ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const deleted = await database.deleteComment(id);
      
      if (!deleted) {
        return new Response(
          JSON.stringify(errorResponse('Comment not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(null, 'Comment deleted successfully')), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to delete comment', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/comments/post/:postId - Get comments by post ID
  async getCommentsByPost(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const postId = url.pathname.split('/').pop();
      
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
        JSON.stringify(errorResponse('Failed to fetch comments by post', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/comments/author/:authorId - Get comments by author ID
  async getCommentsByAuthor(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const authorId = url.pathname.split('/').pop();
      
      if (!authorId) {
        return new Response(
          JSON.stringify(errorResponse('Author ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if author exists
      const author = await database.getUserById(authorId);
      if (!author) {
        return new Response(
          JSON.stringify(errorResponse('Author not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const comments = await database.getCommentsByAuthor(authorId);
      
      return new Response(JSON.stringify(successResponse(comments)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch comments by author', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}

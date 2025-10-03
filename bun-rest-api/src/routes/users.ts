import { database } from '../utils/database';
import { successResponse, errorResponse, validateRequired, isValidEmail, parseQueryParams, sortArray, paginate } from '../utils';
import { User, CreateUserRequest, UpdateUserRequest, ApiResponse, PaginatedResponse } from '../types';

export class UserRoutes {
  // GET /api/users - Get all users with pagination
  async getUsers(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const { page, limit, sortBy, sortOrder } = parseQueryParams(url);
      
      let users = await database.getUsers();
      
      // Apply sorting
      users = sortArray(users, sortBy, sortOrder);
      
      // Apply pagination
      const paginatedUsers = paginate(users, page, limit);
      
      return new Response(JSON.stringify(successResponse(paginatedUsers)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch users', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/users/:id - Get user by ID
  async getUserById(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('User ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const user = await database.getUserById(id);
      
      if (!user) {
        return new Response(
          JSON.stringify(errorResponse('User not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(user)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch user', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // POST /api/users - Create a new user
  async createUser(request: Request): Promise<Response> {
    try {
      const body = await request.json() as CreateUserRequest;
      
      // Validate required fields
      const validationErrors = validateRequired(body, ['name', 'email']);
      if (validationErrors.length > 0) {
        return new Response(
          JSON.stringify(errorResponse('Validation failed', validationErrors.join(', '))),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      if (!isValidEmail(body.email)) {
        return new Response(
          JSON.stringify(errorResponse('Invalid email format')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const user = await database.createUser(body);
      
      return new Response(JSON.stringify(successResponse(user, 'User created successfully')), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('already exists') ? 409 : 500;
      
      return new Response(
        JSON.stringify(errorResponse('Failed to create user', errorMessage)),
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // PUT /api/users/:id - Update a user
  async updateUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      const body = await request.json() as UpdateUserRequest;
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('User ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format if provided
      if (body.email && !isValidEmail(body.email)) {
        return new Response(
          JSON.stringify(errorResponse('Invalid email format')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const user = await database.updateUser(id, body);
      
      if (!user) {
        return new Response(
          JSON.stringify(errorResponse('User not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(user, 'User updated successfully')), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('already exists') ? 409 : 500;
      
      return new Response(
        JSON.stringify(errorResponse('Failed to update user', errorMessage)),
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // DELETE /api/users/:id - Delete a user
  async deleteUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      
      if (!id) {
        return new Response(
          JSON.stringify(errorResponse('User ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const deleted = await database.deleteUser(id);
      
      if (!deleted) {
        return new Response(
          JSON.stringify(errorResponse('User not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify(successResponse(null, 'User deleted successfully')), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to delete user', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET /api/users/:id/posts - Get posts by user
  async getUserPosts(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const userId = pathParts[pathParts.length - 2]; // Get user ID from /api/users/:id/posts
      
      if (!userId) {
        return new Response(
          JSON.stringify(errorResponse('User ID is required')),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if user exists
      const user = await database.getUserById(userId);
      if (!user) {
        return new Response(
          JSON.stringify(errorResponse('User not found')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const posts = await database.getPostsByAuthor(userId);
      
      return new Response(JSON.stringify(successResponse(posts)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(errorResponse('Failed to fetch user posts', error instanceof Error ? error.message : 'Unknown error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}

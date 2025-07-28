// Generic API response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

// HTTP status codes
export type HttpStatusCode =
  | 200 // OK
  | 201 // Created
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 500; // Internal Server Error

// Request types
export type RequestWithUser = {
  user?: {
    id: string;
    email: string;
  };
};

// Error types
export type ApiError = {
  code: HttpStatusCode;
  message: string;
  details?: any;
};

// Validation error type
export type ValidationError = {
  field: string;
  message: string;
  value?: any;
};

export type ValidationErrors = ValidationError[];

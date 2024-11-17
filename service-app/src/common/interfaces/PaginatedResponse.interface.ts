export interface PaginatedResponse<T> {
    message: string;
    data: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }
  
import qs from "qs";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiPost {
  id: number;
  documentId: string;
  title: string;
  content?: string | null;
  published: boolean;
  slug?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  author?: {
    data: {
      id: number;
      attributes: {
        username: string;
        email: string;
      };
    };
  } | null;
  featured_image?: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
        alternativeText?: string;
      };
    };
  } | null;
}

interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
  author?: number;
}

interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

class StrapiClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string = STRAPI_URL, token?: string) {
    this.baseURL = baseURL;
    this.token = token || STRAPI_TOKEN;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage += `. ${errorData.error.message}`;
        }
        if (errorData.error?.details) {
          errorMessage += `. Details: ${JSON.stringify(
            errorData.error.details
          )}`;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
      throw new Error(`Strapi API error: ${errorMessage}`);
    }

    return response.json();
  }

  // Posts methods
  async getPosts(params?: {
    populate?: string[];
    filters?: Record<string, unknown>;
    sort?: string[];
    pagination?: { page?: number; pageSize?: number };
  }): Promise<StrapiResponse<StrapiPost[]>> {
    let query = "";
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.sort) {
        params.sort.forEach((sortItem, index) => {
          queryParams.append(`sort[${index}]`, sortItem);
        });
      }
      if (params.pagination?.pageSize) {
        queryParams.append(
          "pagination[pageSize]",
          params.pagination.pageSize.toString()
        );
      }
      if (params.pagination?.page) {
        queryParams.append(
          "pagination[page]",
          params.pagination.page.toString()
        );
      }
      if (queryParams.toString()) {
        query = `?${queryParams.toString()}`;
      }
    }
    return this.request<StrapiResponse<StrapiPost[]>>(`/posts${query}`);
  }

  async getPost(
    id: number | string,
    params?: { populate?: string[] }
  ): Promise<StrapiResponse<StrapiPost>> {
    const query = params
      ? `?${qs.stringify(params, { encodeValuesOnly: true })}`
      : "";
    return this.request<StrapiResponse<StrapiPost>>(`/posts/${id}${query}`);
  }

  async createPost(data: CreatePostData): Promise<StrapiResponse<StrapiPost>> {
    return this.request<StrapiResponse<StrapiPost>>("/posts", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async updatePost(
    id: number | string,
    data: UpdatePostData
  ): Promise<StrapiResponse<StrapiPost>> {
    return this.request<StrapiResponse<StrapiPost>>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });
  }

  async deletePost(id: number | string): Promise<StrapiResponse<StrapiPost>> {
    return this.request<StrapiResponse<StrapiPost>>(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  async publishPost(id: number | string): Promise<StrapiResponse<StrapiPost>> {
    return this.updatePost(id, { published: true });
  }

  async unpublishPost(
    id: number | string
  ): Promise<StrapiResponse<StrapiPost>> {
    return this.updatePost(id, { published: false });
  }

  // Media upload
  async uploadFile(file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append("files", file);

    return this.request("/upload", {
      method: "POST",
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }
}

// Export singleton instance
export const strapiClient = new StrapiClient();

// Export types
export type { StrapiPost, StrapiResponse, CreatePostData, UpdatePostData };
export default StrapiClient;

// Testimonials API service using Supabase Edge Functions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const API_BASE_URL = `${SUPABASE_URL}/functions/v1`

export interface Testimonial {
  id: number
  name: string
  state: string
  testimony: string
  service: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class TestimonialsAPI {
  private async makeRequest<T>(
    endpoint: string, 
    method: string = 'GET', 
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body)
      }

      console.log(`🔍 Making ${method} request to:`, url)
      if (body) console.log('📦 Request body:', body)

      const response = await fetch(url, options)
      const data = await response.json()

      console.log(`📡 Response (${response.status}):`, data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('❌ API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    return this.makeRequest<Testimonial[]>('/testimonials')
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<ApiResponse<Testimonial[]>> {
    return this.makeRequest<Testimonial[]>('/testimonials', 'POST', testimonial)
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<ApiResponse<Testimonial[]>> {
    return this.makeRequest<Testimonial[]>(`/testimonials/${id}`, 'PUT', testimonial)
  }

  async deleteTestimonial(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/testimonials/${id}`, 'DELETE')
  }
}

export const testimonialsAPI = new TestimonialsAPI()

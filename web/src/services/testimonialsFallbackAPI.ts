// Fallback testimonials service using direct Supabase client
// This can be used while setting up the serverless functions

import { supabase } from '../lib/supabase'

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

class TestimonialsFallbackAPI {
  async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    try {
      console.log('🔍 Fetching testimonials (fallback)...')
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching testimonials:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Testimonials fetched successfully:', data)
      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<ApiResponse<Testimonial[]>> {
    try {
      console.log('➕ Creating testimonial (fallback):', testimonial)
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          ...testimonial,
          created_by: 'admin',
          updated_by: 'admin'
        })
        .select()

      if (error) {
        console.error('❌ Error creating testimonial:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Testimonial created successfully:', data)
      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<ApiResponse<Testimonial[]>> {
    try {
      console.log('📝 Updating testimonial (fallback):', id, testimonial)
      
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          ...testimonial,
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('❌ Error updating testimonial:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Testimonial updated successfully:', data)
      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async deleteTestimonial(id: number): Promise<ApiResponse<void>> {
    try {
      console.log('🗑️ Deleting testimonial (fallback):', id)
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting testimonial:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Testimonial deleted successfully')
      return {
        success: true
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const testimonialsFallbackAPI = new TestimonialsFallbackAPI()
export type { Testimonial, ApiResponse }

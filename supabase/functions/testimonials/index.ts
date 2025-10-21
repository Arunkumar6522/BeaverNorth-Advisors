import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname

    // Route handling
    if (method === 'GET' && path === '/testimonials') {
      // Get all testimonials
      const { data, error } = await supabaseClient
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (method === 'POST' && path === '/testimonials') {
      // Create new testimonial
      const body = await req.json()
      const { name, state, testimony, service, status = 'active' } = body

      if (!name || !testimony) {
        return new Response(
          JSON.stringify({ success: false, error: 'Name and testimony are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data, error } = await supabaseClient
        .from('testimonials')
        .insert({
          name,
          state,
          testimony,
          service,
          status,
          created_by: 'admin',
          updated_by: 'admin'
        })
        .select()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (method === 'PUT' && path.startsWith('/testimonials/')) {
      // Update testimonial
      const id = path.split('/')[2]
      const body = await req.json()
      const { name, state, testimony, service, status } = body

      const { data, error } = await supabaseClient
        .from('testimonials')
        .update({
          name,
          state,
          testimony,
          service,
          status,
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        })
        .eq('id', id)
        .select()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (method === 'DELETE' && path.startsWith('/testimonials/')) {
      // Delete testimonial
      const id = path.split('/')[2]

      const { error } = await supabaseClient
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Route not found
    return new Response(
      JSON.stringify({ success: false, error: 'Route not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function addPost(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('blog_posts')
    .insert([{ title, content }])
    
  if (!error) {
    revalidatePath('/blog')
  }
  
  return { error }
}
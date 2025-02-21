export type Database = {
    public: {
      Tables: {
        posts: {
          Row: {
            id: string
            title: string
            slug: string
            content: string | null
            featured_image: string | null
            excerpt: string | null
            author_id: string
            status: 'draft' | 'published'
            published_at: string | null
            created_at: string
            updated_at: string
          }
        }
        profiles: {
          Row: {
            id: string
            full_name: string
            // ... other profile fields
          }
        }
      }
    }
  }
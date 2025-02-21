'use client'

import { useEffect, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RTEProps {
  value: string
  onChange: (content: string) => void
  className?: string
}

export default function RTEditor({ value, onChange, className }: RTEProps) {
  const editorRef = useRef<any>(null)

  return (
    <div className={className}>
      <Editor
        apiKey="m4fnvu33rqatr950sdyko993s6ts8odbp1hzkwzg4baizvsb" // از سایت TinyMCE دریافت کنید - برای تست می‌توانید خالی بگذارید
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(newValue) => onChange(newValue)}
        init={{
          directionality: 'rtl', // برای پشتیبانی از زبان فارسی
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </div>
  )
}
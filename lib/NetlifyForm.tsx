// lib/NetlifyForm.tsx
import React, { FormHTMLAttributes, ReactNode } from 'react';

type NetlifyFormProps = {
  name: string;
  children: ReactNode;
  action?: string;
} & FormHTMLAttributes<HTMLFormElement>;

export default function NetlifyForm({ name, children, action, ...props }: NetlifyFormProps) {
  return (
    <form
      name={name}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      action={action || ''}
      {...props}
    >
      <input type="hidden" name="form-name" value={name} />
      <div hidden>
        <input name="bot-field" />
      </div>
      {children}
    </form>
  );
}
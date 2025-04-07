"use client";
export default function RTLlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" dir="rtl" lang="fa">
      {children}
    </div>
  );
}
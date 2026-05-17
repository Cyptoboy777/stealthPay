import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { LayoutShell } from './layout-shell';

export const metadata: Metadata = {
  title: 'StealthPay',
  description: 'Web3 Payroll & Treasury platform featuring fully encrypted, compliant payroll and expense management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#02050A]">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}

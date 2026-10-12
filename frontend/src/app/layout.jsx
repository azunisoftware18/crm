import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ToastProvider } from "@/components/common/Toast";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SHREE NATH EXPORTS — CRM & ERP",
  description: "Shree Nath Exports CRM and ERP System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="h-full antialiased">
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

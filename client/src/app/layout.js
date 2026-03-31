import "./globals.css";
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: "TradeSync - Trading Journal SaaS",
  description: "Premium trading journal for serious traders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

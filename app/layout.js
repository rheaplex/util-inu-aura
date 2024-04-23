import "./globals.scss";
import { Providers } from './providers';

export const metadata = {
  title: "Util/Inu/Aura",
  description: "Solving the utility problem.",
};

export default function RootLayout({children}) {
  return (
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
  );
}

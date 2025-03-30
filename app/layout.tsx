import type { Metadata } from "next";
import Providers from "./Providers";
import "./globals.css";
import Authenticate from "./Authenticate";
import { Slide, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Progressbar from "@/components/Progressbar";

export const metadata: Metadata = {
  title: "Code Smack",
  description: "Sword of Code!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" >
      <body className={`kanit-regular overflow-hidden min-h-screen antialiased text-white bg-gradient-to-br`} style={{
        background: 'linear-gradient(45deg, rgb(0, 0, 0), rgb(13, 12, 12), rgb(0, 0, 0))',
      }
      } >

        <Providers>
          <Authenticate>
            <Progressbar />
            {children}
            <ToastContainer
              position="bottom-right"
              transition={Slide}
              autoClose={1000}
              hideProgressBar
              theme="dark"
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

          </Authenticate>
        </Providers>
      </body>
    </html>
  );
}

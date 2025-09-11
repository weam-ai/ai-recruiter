import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth.context";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoloUp",
  description: "AI-powered Interviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var chatbotConfig = {
                  _id: '68c270e6327969ed36f26e61',
                  theme: 'light',
                  position: 'bottom-right',
                  size: {
                    width: '400px',
                    height: '600px'
                  },
                  autoOpen: true,
                  welcomeMessage: 'Hi! How can I help you today inside weam?',
                  customCSS: \`\`,
                  customJS: \`\`
                };
                
                var script = document.createElement('script');
                script.src = 'https://dev.weam.ai/ai-chatbot/widget/chat-widget.js';
                script.async = true;
                script.onload = function() {
                  if (window.AIChatbotWidget) {
                    window.AIChatbotWidget.init(chatbotConfig);
                  }
                };
                document.head.appendChild(script);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}


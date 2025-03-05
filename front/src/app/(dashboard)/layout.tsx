import { ChatBot } from "@/components/chat-bot";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            {children}
            <ChatBot />
        </main>
    );
}

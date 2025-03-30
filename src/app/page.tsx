import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  LogIn,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Upload from "@/components/Upload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { HeroSection } from "@/components/Hero";

export default async function Home() {
  const { userId, redirectToSignIn } = await auth();
  const isAuth = !!userId;

  // if (!isAuth) return redirectToSignIn();

  let firstChat;
  try {
    if (userId) {
      const userChats = await db
        .select({ id: chats.id, pdfName: chats.pdfName })
        .from(chats)
        .where(eq(chats.userId, userId))
        .limit(1);

      firstChat = userChats[0] || null;
    }
  } catch (error) {
    console.error("Error fetching user chats:", error);
    firstChat = null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 pl-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">notefuse</span>
          </div>
          {/* <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
          </nav> */}
          {/* <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Log in
            </Button>
            <Button size="sm">Sign up</Button>
          </div> */}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Study smarter, not harder
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Transform Your Notes into{" "}
              <span className="text-primary">Interactive Study Sessions</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              NoteFuse uses AI to turn your study notes into engaging
              conversations, helping you understand complex topics and retain
              information better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {/* <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button> */}
              {/* <Button size="lg" variant="outline">
                See Demo
              </Button> */}
            </div>
            <div></div>
            <div className="flex mt-2">
              {isAuth && firstChat && (
                <>
                  <Link href={`/chat/${firstChat.id}`}>
                    <Button>
                      Go to Chats <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="w-full max-w-xl">
              {isAuth ? (
                <Upload />
              ) : (
                <Link href="/sign-in">
                  <Button>
                    Login to get started
                    <LogIn className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NoteFuse. All rights reserved.
        </div>
      </footer>
    </div>

    // <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
    //   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    // <div className="flex flex-col items-center text-center">
    //   <div className="flex items-center">
    //     <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
    //   </div>
    //   <div className="flex mt-2">
    //     {isAuth && firstChat && (
    //       <>
    //         <Link href={`/chat/${firstChat.id}`}>
    //           <Button>
    //             Go to Chats <ArrowRight className="ml-2" />
    //           </Button>
    //         </Link>
    //       </>
    //     )}
    //   </div>
    //   <div className="w-full mt-4">
    //     {isAuth ? (
    //       <Upload />
    //     ) : (
    //       <Link href="/sign-in">
    //         <Button>
    //           Login to get started
    //           <LogIn className="w-4 h-4 ml-2" />
    //         </Button>
    //       </Link>
    //     )}
    //   </div>
    // </div>
    //   </div>
    // </div>
  );
}

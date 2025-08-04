"use client";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/(components)/context/zustand-store";

export default function Navbar() {
  const [clientLoaded, setClientLoaded] = useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    setClientLoaded(true);
  }, []);

  //  const location =  window. && window.location.href;

  //add delay on client mount for server-side rendering
  if (!clientLoaded)
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );

  return (
    <nav className="w-full font-mono">
      <header className="md:w-[90%] w-full mx-auto bg-primary-foreground flex items-center justify-between p-2 py-3 md:my-5 rounded-xl max-md:rounded-none shadow shadow-foreground/20">
        <ul className="flex items-center gap-5 max-md:gap-2">
          <li>
            <Link
              href={"/"}
              className={`p-2  md:rounded-sm md:hover:text-background md:hover:bg-foreground transition-all ${
                pathname === "/" ?"bg-foreground text-background" : 'text-foreground'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={"/about"}
              className={`p-2  md:rounded-sm md:hover:text-background md:hover:bg-foreground transition-all ${
                pathname === "/about" ? "bg-foreground text-background" : "text-foreground"
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href={"/contact-us"}
              className={`p-2  md:rounded-sm md:hover:text-background md:hover:bg-foreground transition-all ${
                pathname === "/contact-us" ? "bg-foreground text-background" : "text-foreground"
              }`}
            >
              Contact Us
            </Link>
          </li>
        </ul>

        <section className="flex items-center gap-3">
          {accessToken ? (
            <Button className="rounded-sm hover:bg-destructive/80 text-white bg-destructive">
              Logout
            </Button>
          ) : (
            <Button
              className="rounded-sm"
              onClick={() =>
                router.push(
                  pathname === "/auth/login"
                    ? "/auth/register"
                    : pathname === "/auth/register"
                    ? "/auth/login"
                    : "/auth/login"
                )
              }
            >
              {pathname === "/auth/login"
                ? "Register"
                : pathname === "/auth/register"
                ? "Login"
                : "Login"}
            </Button>
          )}

          {/* theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-foreground hover:bg-foreground/80 text-background hover:text-background dark:text-foreground dark:hover:text-foreground">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </header>
    </nav>
  );
}

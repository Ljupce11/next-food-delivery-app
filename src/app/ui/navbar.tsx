"use client";

import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../public/logo.png";
import { signOutAction } from "../lib/actions";

export default function Navbar() {
  return (
    <NextNavbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src={Logo} className="h-8 w-8" alt="Flowbite Logo" />
          <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Food delivery</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="bg-blue-100 rounded-xl px-3 py-2 text-blue-700" href="/sign-up">
            Sign up
          </Link>
        </NavbarItem>
        <NavbarItem>
          <form action={signOutAction}>
            <button className="bg-blue-100 rounded-xl px-3 py-2 text-blue-700" type="submit">
              Sign out
            </button>
          </form>
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
}

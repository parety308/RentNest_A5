import * as React from "react"

import { cn } from "@/lib/utils"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import Link, { LinkProps } from "next/link"



function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn(
        "mx-auto flex w-full justify-center py-6",
        className
      )}
      {...props}
    />
  )
}



function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex items-center gap-2 rounded-xl bg-muted/40 p-2 backdrop-blur",
        className
      )}
      {...props}
    />
  )
}



function PaginationItem({
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li {...props} />
  )
}



type PaginationLinkProps = {
  isActive?: boolean
} & LinkProps &
  React.ComponentProps<"a">



function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {

  return (
    <Link
      aria-current={
        isActive ? "page" : undefined
      }
      className={cn(
        `
        flex h-9 min-w-9
        items-center justify-center
        rounded-lg px-3
        text-sm font-medium
        transition-all duration-200
        `,
        isActive
          ? `
            bg-primary
            text-primary-foreground
            shadow-md
            scale-105
          `
          : `
            hover:bg-accent
            hover:scale-105
          `,
        className
      )}
      {...props}
    />
  )
}



function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string
}) {

  return (
    <PaginationLink
      aria-label="Previous page"
      className={cn(
        "gap-2 px-3",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />

      <span className="hidden sm:block">
        {text}
      </span>

    </PaginationLink>
  )
}



function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string
}) {

  return (
    <PaginationLink
      aria-label="Next page"
      className={cn(
        "gap-2 px-3",
        className
      )}
      {...props}
    >

      <span className="hidden sm:block">
        {text}
      </span>

      <ChevronRightIcon className="h-4 w-4" />

    </PaginationLink>
  )
}



function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {

  return (
    <span
      aria-hidden
      className={cn(
        `
        flex h-9 w-9
        items-center justify-center
        rounded-lg
        text-muted-foreground
        `,
        className
      )}
      {...props}
    >

      <MoreHorizontalIcon className="h-4 w-4" />

      <span className="sr-only">
        More pages
      </span>

    </span>
  )
}



export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
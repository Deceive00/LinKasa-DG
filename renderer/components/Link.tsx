import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link'

type NextComposedProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  NextLinkProps

const NextComposed = React.forwardRef(function NextComposed(
  props: NextComposedProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  const { as, href, ...other } = props

  return (
    <NextLink href={href} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  )
})

interface LinkPropsBase {
  activeClassName?: string
  innerRef?: React.Ref<HTMLAnchorElement>
  naked?: boolean
}

type LinkProps = LinkPropsBase & NextComposedProps & Omit<MuiLinkProps, 'ref'>

function Link(props: LinkProps) {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props

  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pathname = typeof href === 'string' ? href : (href as any).pathname
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })

  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    )
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href}
      {...other}
    />
  )
}

// eslint-disable-next-line react/display-name
export default React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link {...props} innerRef={ref} />
))

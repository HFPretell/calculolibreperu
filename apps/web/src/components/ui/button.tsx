import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './button.styles'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />
}

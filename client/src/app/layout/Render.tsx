import * as React from 'react'

interface Props {
  children: React.ReactNode
  condition?: boolean | null | undefined
  ignoreTernary?: boolean
}

/**
 * If children is a single component it will only render if the condition is met.
 *
 * If there are two children, the first child will render when the condition is met, second if the condition is not met.
 *
 * If there are three or more children, everything will be rendered when the condition is met.
 *
 * Default condition: false
 */
export default function Render({ children, condition = false, ignoreTernary = false }: Props) {
  const childrenArray = React.Children.toArray(children)
  const isTernary = childrenArray.length === 2

  const render = () => {
    if (isTernary && !ignoreTernary) {
      return condition ? childrenArray[0] : childrenArray[1]
    } else return condition ? childrenArray : null
  }

  return <> {render()} </>
}

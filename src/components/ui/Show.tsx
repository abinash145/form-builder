import { ReactNode } from 'react';

type Accessor<T> = () => T;

const Show = <T,>(props: {
  when: T | undefined | null | false;
  fallback?: ReactNode;
  children: ReactNode | ((item: T | Accessor<T>) => ReactNode);
}) => {
  if (props.when) {
    // Handle when `children` is a function
    if (typeof props.children === "function") {
      return (
        <>
          {(props.children as (item: T | Accessor<T>) => ReactNode)(props.when)}
        </>
      );
    }
    // Handle when `children` is a JSX element
    return <>{props.children}</>;
  }

  // Render fallback if `when` is false
  return <>{props.fallback}</>;
};

export default Show;

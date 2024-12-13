import React from "react";

interface ForProps<T, U extends React.ReactNode> {
  each: readonly T[];
  fallback?: React.ReactNode;
  children: (item: T, index: number) => U;
  generateKey?: (item: T, index: number) => React.Key;
}

function For<T, U extends React.ReactNode>({
  each,
  fallback,
  children,
  generateKey,
}: ForProps<T, U>): React.ReactElement {
  if (each.length === 0) {
    return <>{fallback || null}</>;
  }

  return (
    <>
      {each.map((item, index) => {
        const key = generateKey ? generateKey(item, index) : index;
        return (
          <React.Fragment key={key}>{children(item, index)}</React.Fragment>
        );
      })}
    </>
  );
}

export default For;

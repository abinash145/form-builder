import React, { ReactNode } from "react";

interface IFProps {
  children?: React.ReactNode;
  render?: () => ReactNode;
  otherwise?: () => ReactNode;
  condition?: boolean | (() => boolean);
}

const IF = ({
  children,
  condition,
  otherwise = () => undefined,
  render,
}: IFProps) => {
  const isConditionTrue =
    typeof condition === "function" ? condition() : condition;

  if (isConditionTrue) {
    if (render) {
      return render();
    }
    if (children) return children;

    return null;
  }
  return otherwise?.();
};

export default IF;

import React from 'react';

interface ISwitchProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface IMatchProps<T> {
  when: T | undefined | null | false;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

const Switch = ({ fallback, children }: ISwitchProps) => {
  let matchFound = false;
  // Clone children and check if any Match condition is met
  const renderedChildren = React.Children.map(children, (child: any) => {
    if (child.type === Match) {
      const conditionMet = child.props.when;
      if (conditionMet) {
        matchFound = true;
      }
      return child;
    }
    return child;
  });

  // If no condition matched, render the fallback
  return <>{matchFound ? renderedChildren : fallback || null}</>;
};

const Match = <T,>({ when, children }: IMatchProps<T>) => {
  if (when) {
    return typeof children === "function" ? children(when) : children;
  }
  return null;
};

export { Match, Switch };

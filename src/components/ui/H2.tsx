import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const H2 = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h2 className={cn("text-lg font-bold ", className)}>{children}</h2>;
};

export default H2;

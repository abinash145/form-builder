import { SVGProps } from "react";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface IconProps {
  iconName: LucideIcon;
  size?: number;
  className?: string;
}

const Icon = ({
  iconName: SVGIcon,
  size = 24,
  className,
  ...props
}: IconProps & Partial<SVGProps<SVGSVGElement>>) => {
  if (!SVGIcon) {
    return null;
  }

  return (
    <SVGIcon width={size} height={size} className={cn(className)} {...props} />
  );
};

export default Icon;

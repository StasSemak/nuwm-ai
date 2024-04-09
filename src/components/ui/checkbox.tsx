import React from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    labelChildren?: React.ReactNode;
  }

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, labelChildren, type, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <label htmlFor={props.id} className="mr-2">
          {labelChildren}
        </label>
        <input type="checkbox" ref={ref} className={cn(className)} {...props} />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

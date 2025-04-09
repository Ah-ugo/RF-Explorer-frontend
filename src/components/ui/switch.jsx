"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

const Switch = React.forwardRef(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (event) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <label className={cn("inline-flex items-center", className)}>
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <div className="peer relative h-6 w-11 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors after:absolute after:left-0 after:top-0 after:h-5 after:w-5 after:translate-x-0 after:rounded-full after:bg-background after:shadow-lg after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };

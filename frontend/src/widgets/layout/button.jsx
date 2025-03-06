import { Button as DefaultButton } from "@material-tailwind/react";
export function Button({
  children,
  variant = "outlined",  // Meaningful prop for button variant
  color = "",      // Default color
  size = "md",
  type = "button",        // Default size
  fullWidth = false,
  className = '', // Full width option
  ...rest              // Additional props like onClick, etc.
}) {
  return (
    <DefaultButton
      className={`flex items-center gap-2 ${className}`}
      variant={variant}
      color={color}
      type={type}
      size={size}
      fullWidth={fullWidth}
      {...rest}  // Pass other props like onClick, etc.
    >
      {children}
    </DefaultButton>
  );
}



export default Button;

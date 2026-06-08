export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor: _backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const baseClasses = "inline-block cursor-pointer border-0 rounded-[3em] font-bold leading-none font-sans";
  const modeClasses = primary 
    ? "bg-[#555ab9] text-white" 
    : "shadow-[rgba(0,0,0,0.15)_0_0_0_1px_inset] bg-transparent text-[#333]";
  const sizeClasses = {
    small: "px-[16px] py-[10px] text-[12px]",
    medium: "px-[20px] py-[11px] text-[14px]",
    large: "px-[24px] py-[12px] text-[16px]"
  }[size];

  return (
    <button
      type="button"
      className={`${baseClasses} ${modeClasses} ${sizeClasses}`}
      {...props}
    >
      {label}
    </button>
  );
};

import { Icon } from "@phosphor-icons/react";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";
import { useFormContext } from "react-hook-form";

interface FieldProps {
  children: ReactNode;
}

function Field({ children }: FieldProps) {
  return <div className="flex w-full flex-col">{children}</div>;
}

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

function Label({ children, ...props }: LabelProps) {
  return (
    <label className="mb-1 text-sm uppercase text-neutral-500" {...props}>
      {children}
    </label>
  );
}

interface EntryProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

function Entry({ children, name, ...props }: EntryProps) {
  let hasLeftIcon = false;
  let hasRightIcon = false;

  const { register } = useFormContext();

  if (children) {
    if (Array.isArray(children)) {
      children.map((child) => {
        const position = child.props.position;
        const childComponentName = child.type.name;

        if (
          (position && position === "left") ||
          childComponentName === "Icon"
        ) {
          hasLeftIcon = true;
        }

        if (
          (position && position === "right") ||
          childComponentName === "Button"
        ) {
          hasRightIcon = true;
        }
      });
    } else {
      const position = children.props.position;
      const childComponentName = children.type.name;

      if (
        (position && position === "left") ||
        (childComponentName === "Icon" && position !== "right")
      ) {
        hasLeftIcon = true;
      }

      if (
        (position && position === "right") ||
        childComponentName === "Button"
      ) {
        hasRightIcon = true;
      }
    }
  }

  return (
    <div className="relative mb-6 flex items-center rounded-md border border-neutral-700 focus-within:border-transparent focus-within:bg-neutral-800 focus-within:ring-2">
      <input
        className={clsx("h-12 w-full bg-transparent  outline-none", [
          { "pl-12": hasLeftIcon },
          { "pr-12": hasRightIcon },
          { "pl-4": !hasLeftIcon },
          { "pr-4": !hasRightIcon },
        ])}
        {...register(name)}
      />

      {children}
    </div>
  );
}

const iconVariants = cva(
  "absolute flex items-center justify-center text-neutral-700 pointer-events-none",
  {
    variants: {
      position: {
        left: "left-4",
        right: "right-4",
      },
    },
    defaultVariants: {
      position: "left",
    },
  }
);

interface IconProps extends VariantProps<typeof iconVariants> {
  svg: Icon;
}

function Icon({ svg, position }: IconProps) {
  const Icon = svg;

  return (
    <div
      className={iconVariants({ position })}
      onClick={() => console.log("oi")}
    >
      <Icon height={20} width={20} weight="fill" />
    </div>
  );
}

const buttonVariants = cva("absolute flex h-10 items-center justify-center", {
  variants: {
    position: {
      left: "left-4",
      right: "right-4",
    },
  },
  defaultVariants: {
    position: "right",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ children, position, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ position })} {...props}>
      {children}
    </button>
  );
}

export const Input = {
  Field,
  Label,
  Entry,
  Icon,
  Button,
};

import React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  colorScheme?: string;
}

export function SwitchField({
  checked,
  onCheckedChange,
  colorScheme = "blue",
}: SwitchProps) {
  return (
    <label
      style={{
        position: "relative",
        display: "inline-block",
        width: "44px",
        height: "24px",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          position: "absolute",
          cursor: "pointer",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: checked
            ? colorScheme === "green"
              ? "#48bb78"
              : "#3182ce"
            : "#cbd5e0",
          borderRadius: "24px",
          transition: "0.3s",
        }}
      >
        <span
          style={{
            position: "absolute",
            content: "",
            height: "18px",
            width: "18px",
            left: checked ? "23px" : "3px",
            bottom: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            transition: "0.3s",
          }}
        />
      </span>
    </label>
  );
}

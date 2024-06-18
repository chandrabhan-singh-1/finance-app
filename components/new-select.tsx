"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  value?: string | null | undefined;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  placeholder?: string;
};

export const NewSelect = ({
  onCreate,
  onChange,
  value,
  options = [],
  disabled,
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
      className="text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "e2e8f0",
          ":hover": {
            borderColor: "e2e8f0",
          },
        }),
      }}
    />
  );
};

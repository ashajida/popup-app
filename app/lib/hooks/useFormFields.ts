import { useCallback, useState } from "react";

export type UserFormFieldsProps = {
  defaultHeading?: string;
  defaultContent?: string;
  defaultName?: string;
  defaultHeadingFontSize?: number;
  defaultHeadingFontWeight?: string;
  defaultHeadingColor?: string;
  defaultDescriptionFontSize?: number;
  defaultDescriptionFontWeight?: string;
  defaultDescriptionColor?:string;
};

export const useFormFields = ({
  defaultName,
  defaultContent,
  defaultHeading,
  defaultDescriptionFontSize,
  defaultHeadingFontSize,
  defaultHeadingFontWeight,
  defaultDescriptionFontWeight,
  defaultHeadingColor,
  defaultDescriptionColor,
}: UserFormFieldsProps) => {
  const [heading, setHeading] = useState<string>(defaultHeading || "");
  const [content, setContent] = useState<string>(defaultContent || "");
  const [name, setName] = useState<string>(defaultName || "");
  const [headingFontSize, setHeadingFontSize] = useState<number>(
    defaultHeadingFontSize || 50,
  );
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(
    defaultDescriptionFontSize || 24,
  );
  const [descriptionFontWeight, setDescriptionFontWeight] = useState(
    defaultDescriptionFontWeight || "400",
  );
  const [headingFontWeight, setHeadingFontWeight] = useState(
    defaultHeadingFontWeight || "700",
  );
  const [headingColor, setHeadingColor] = useState(defaultHeadingColor || "#000000");
  const [descriptionColor, setDescriptionColor] = useState(defaultDescriptionColor || "#000000");

  const headingFontSizeSliderChange = useCallback(
    (value: number) => {
      setHeadingFontSize(value);
    },
    [setHeadingFontSize],
  );

  const handleHeadingFontWeightChange = useCallback(
    (value: string) => setHeadingFontWeight(value),
    [setHeadingFontWeight],
  );

  const descriptionFontSizeSliderChange = useCallback(
    (value: number) => {
      setDescriptionFontSize(value);
    },
    [setDescriptionFontSize],
  );

  const handleDescriptionFontWeightChange = useCallback(
    (value: string) => setDescriptionFontWeight(value),
    [],
  );

  const handleContentChange = useCallback(
    (newValue: string) => setContent(newValue),
    [setContent],
  );

  const handleHeadingChange = useCallback(
    (newValue: string) => setHeading(newValue),
    [setHeading],
  );

  const handleNameChange = useCallback(
    (newValue: string) => setName(newValue),
    [setName],
  );

  const handleHeadingColorChange = useCallback(
    (value: string) => {
      setHeadingColor(value);
    },
    [setHeadingColor],
  );

  const handleDescriptionColorChange = useCallback(
    (value: string) => {
      setDescriptionColor(value);
    },
    [setDescriptionColor],
  );

  return {
    heading,
    content,
    name,
    headingFontSize,
    descriptionFontSize,
    headingFontWeight,
    descriptionFontWeight,
    headingColor,
    descriptionColor,
    handleContentChange,
    handleHeadingChange,
    handleNameChange,
    handleDescriptionFontWeightChange,
    descriptionFontSizeSliderChange,
    headingFontSizeSliderChange,
    handleHeadingFontWeightChange,
    handleHeadingColorChange,
    handleDescriptionColorChange,
  };
};

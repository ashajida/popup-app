import React from 'react'
import EnhancedColorPicker, { EnhancedColorPickerProps } from './EhancedColorPicker'
import { BlockStack, RangeSlider, Select } from '@shopify/polaris'

type Props = {
    color: string;
    setColor: EnhancedColorPickerProps["setColor"];
    fontSize: number;
    handleFontSizeSliderChange: (value: number) => void;
    fontWeight: string;
    handleFontWeightChange: (value: string) => void;
}

const AppearanceSettings = ({color, setColor, fontSize, handleFontSizeSliderChange, fontWeight, handleFontWeightChange}: Props) => {
  return (
    <BlockStack gap="400">
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <EnhancedColorPicker
                color={color}
                setColor={setColor}
              />
                <label>
                  Color
              </label>
            </div>
            <div style={{ margin: '1rem 0', padding: "1rem 0" }}>
                <span style={{
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              color: color
            }}>Abc</span>
            </div>
             <RangeSlider
                label="Heading Font Size"
                min={20}
                max={60}
                value={fontSize}
                onChange={handleFontSizeSliderChange}
                output
              />
                  <Select
      label="Heading Font Weight"
      options={[
        { label: 'Light', value: '300' },
        { label: 'Regular', value: '400' },
        { label: 'Medium', value: '500' },
        { label: 'Bold', value: '700' },
      ]}
      onChange={handleFontWeightChange}
      value={fontWeight}
    />
    </BlockStack>
  )
}

export default AppearanceSettings
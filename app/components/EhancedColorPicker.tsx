export type EnhancedColorPickerProps = {
  color: string;
  setColor: (value: string) => void;
}
const EnhancedColorPicker = ({color, setColor}: EnhancedColorPickerProps) => {
  return (
    <>
      <input type="color" onChange={(e) => {
        const value = e.currentTarget.value;
        console.log("color picked:", value);
        setColor(value)
      }}  value={color} />
    </>
);
}

export default EnhancedColorPicker;

// export const colorToHslString = (color: Props['color']): string => {
//   return `hsl(${color.hue}, ${color.saturation * 100}%, ${color.brightness * 100}%)`;
// };

// export const hslStringToObject = (hslString: string): Props['color'] => {
//   // Parse HSL string like "hsl(120, 50%, 75%)"
//   const matches = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  
//   if (!matches) {
//     // Return default color if parsing fails
//     return { hue: 0, saturation: 1, brightness: 0.5 };
//   }
  
//   const hue = parseInt(matches[1]);
//   const saturation = parseInt(matches[2]) / 100; // Convert to 0-1 range
//   const brightness = parseInt(matches[3]) / 100; // Convert to 0-1 range
  
//   return { hue, saturation, brightness };
// };
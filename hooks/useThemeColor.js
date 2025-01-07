/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "..//constants/Colors";
import { useColorScheme } from "..//hooks/useColorScheme";

export function useThemeColor(userType) {
  const theme = useColorScheme() ?? "light";
  console.log("theme", theme);
  console.log("userType", userType);

  if (!userType) {
    return Colors.transporter[theme];
  }

  return Colors[userType.toLowerCase()]["light" || theme];
}

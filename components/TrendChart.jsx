import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "../constants/theme";

/**
 * TrendChart draws a simple 7-point line chart with area fill.
 */
export default function TrendChart({ data, height = 120 }) {
  const { colors } = useTheme();
  if (!data || data.length === 0) {
    return <View style={{ height }} />;
  }
  const maxVal = Math.max(...data, 1);
  const width = 500;
  const pointGap = (width - 20) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = 10 + pointGap * i;
    const y = height - 20 - (v / maxVal) * (height - 40);
    return { x, y };
  });
  const path = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    "",
  );
  return (
    <View style={{ height }}>
      <Svg
        width="100%"
        height={height}
        preserveAspectRatio="none"
        viewBox={`0 0 ${width} ${height}`}
      >
        <Path
          d={`${path} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${
            height - 20
          } Z`}
          fill={colors.primary + "33"}
        />
        <Path d={path} stroke={colors.primary} strokeWidth={2} fill="none" />
        {points.map((p, idx) => (
          <Circle key={idx} cx={p.x} cy={p.y} r={3} fill={colors.primary} />
        ))}
      </Svg>
    </View>
  );
}

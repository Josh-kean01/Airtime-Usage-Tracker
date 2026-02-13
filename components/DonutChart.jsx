import React from "react";
import { View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

/**
 * DonutChart renders a simple donut chart for provider breakdown.
 * Each data item: { key, value, color }
 */
export default function DonutChart({ data, size = 200, strokeWidth = 28 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    // Draw empty ring
    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth) / 2}
            stroke="#eee"
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
      </View>
    );
  }

  // Convert degrees to path commands
  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const radius = (size - strokeWidth) / 2;
  let cumulative = 0;
  const arcs = data.map((item) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += item.value;
    const endAngle = (cumulative / total) * 360;
    return {
      ...item,
      path: describeArc(size / 2, size / 2, radius, startAngle, endAngle),
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {arcs.map((arc) => (
          <Path
            key={arc.key}
            d={arc.path}
            stroke={arc.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}

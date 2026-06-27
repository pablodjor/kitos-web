import { useMemo } from "react";
import Snowfall from "react-snowfall";
import styles from "./PageSnow.module.scss";

const NINTENDO_COLORS = [
  "#e60012",
  "#00a7e1",
  "#fcc800",
  "#1edc00",
  "#ff008c",
];

function drawSnowflakeArm(ctx, length, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length);
  ctx.stroke();

  const branchStart = length * 0.45;
  const branchSize = length * 0.28;

  ctx.beginPath();
  ctx.moveTo(0, -branchStart);
  ctx.lineTo(branchSize, -(branchStart + branchSize * 0.55));
  ctx.moveTo(0, -branchStart);
  ctx.lineTo(-branchSize, -(branchStart + branchSize * 0.55));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -length * 0.78);
  ctx.lineTo(branchSize * 0.7, -(length * 0.78 + branchSize * 0.45));
  ctx.moveTo(0, -length * 0.78);
  ctx.lineTo(-branchSize * 0.7, -(length * 0.78 + branchSize * 0.45));
  ctx.stroke();
}

function createSnowflakeImage(size, strokeColor) {
  const canvas = document.createElement("canvas");
  const padding = 8;
  canvas.width = size + padding * 2;
  canvas.height = size + padding * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return canvas;
  }

  const center = canvas.width / 2;
  const radius = size / 2;

  ctx.translate(center, center);

  ctx.shadowColor = "rgba(148, 163, 184, 0.45)";
  ctx.shadowBlur = 5;

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = Math.max(1.2, radius * 0.11);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < 6; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI / 3) * i);
    drawSnowflakeArm(ctx, radius * 0.92, ctx.lineWidth);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  return canvas;
}

export default function PageSnow() {
  const snowflakes = useMemo(() => {
    const sizes = [16, 20, 24, 28, 32];

    return sizes.flatMap((size) =>
      NINTENDO_COLORS.map((color) => createSnowflakeImage(size, color))
    );
  }, []);

  return (
    <div className={styles.overlay} aria-hidden="true">
      <Snowfall
        images={snowflakes}
        snowflakeCount={70}
        radius={[14, 32]}
        opacity={[0.82, 1]}
        speed={[0.7, 2.8]}
        wind={[-1, 2]}
        rotationSpeed={[-0.5, 0.5]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

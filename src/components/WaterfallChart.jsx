"use client";

import { useEffect, useRef } from "react";

const WaterfallChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      drawWaterfall(ctx, canvas.width, canvas.height);
    };

    // Initial resize
    resizeCanvas();

    // Listen for window resize
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const drawWaterfall = (ctx, width, height) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate sample data - in a real app, this would come from your API
    const frequencyBins = 100;
    const timeBins = 50;

    // Create a color gradient for power levels
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgb(0, 0, 255)"); // -120 dBm (low)
    gradient.addColorStop(0.5, "rgb(0, 255, 0)"); // -80 dBm (medium)
    gradient.addColorStop(1, "rgb(255, 0, 0)"); // -40 dBm (high)

    // Calculate cell dimensions
    const cellWidth = width / frequencyBins;
    const cellHeight = height / timeBins;

    // Draw waterfall
    for (let t = 0; t < timeBins; t++) {
      for (let f = 0; f < frequencyBins; f++) {
        // Generate random power level between -120 and -40 dBm
        const power = Math.random() * 80 - 120;

        // Normalize power to 0-1 range for color mapping
        const normalizedPower = (power + 120) / 80;

        // Set color based on power level
        const r = Math.floor(normalizedPower * 255);
        const g = Math.floor((1 - Math.abs(normalizedPower - 0.5) * 2) * 255);
        const b = Math.floor((1 - normalizedPower) * 255);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(f * cellWidth, t * cellHeight, cellWidth, cellHeight);
      }
    }

    // Draw frequency axis
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, height - 20, width, 20);

    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

    for (let f = 0; f <= 10; f++) {
      const x = (f / 10) * width;
      const freq = 470 + (f / 10) * 300;
      ctx.fillText(`${freq}`, x, height - 6);
    }

    // Draw legend
    const legendWidth = 20;
    const legendHeight = height - 40;
    const legendX = width - legendWidth - 10;
    const legendY = 20;

    // Draw gradient
    const legendGradient = ctx.createLinearGradient(
      0,
      legendY,
      0,
      legendY + legendHeight
    );
    legendGradient.addColorStop(0, "rgb(255, 0, 0)"); // -40 dBm (high)
    legendGradient.addColorStop(0.5, "rgb(0, 255, 0)"); // -80 dBm (medium)
    legendGradient.addColorStop(1, "rgb(0, 0, 255)"); // -120 dBm (low)

    ctx.fillStyle = legendGradient;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);

    // Draw legend border
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

    // Draw legend labels
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText("-40 dBm", legendX - 5, legendY + 10);
    ctx.fillText("-80 dBm", legendX - 5, legendY + legendHeight / 2 + 5);
    ctx.fillText("-120 dBm", legendX - 5, legendY + legendHeight - 5);
  };

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default WaterfallChart;

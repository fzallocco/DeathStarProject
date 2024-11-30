import React, { useEffect, useRef } from "react";

const DeathStar = () => {
  const light = [-50, 0, 50]; // Light source position
  const posSphere = { cx: 200, cy: 200, cz: 0, r: 100 }; // Positive sphere
  const negSphere = { cx: 50, cy: 50, cz: -60, r: 50 }; // Negative sphere

  // Normalize a vector
  const normalize = (v) => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    v[0] /= len;
    v[1] /= len;
    v[2] /= len;
  };

  // Dot product of two vectors
  const dot = (x, y) => Math.max(0, x[0] * y[0] + x[1] * y[1] + x[2] * y[2]);

  // Check if a ray hits a sphere
  const hitSphere = (sphere, x, y) => {
    const dx = x - sphere.cx;
    const dy = y - sphere.cy;
    const zSq = sphere.r * sphere.r - (dx * dx + dy * dy);
    if (zSq < 0) return null;
    const z = Math.sqrt(zSq);
    return [sphere.cz - z, sphere.cz + z];
  };

  // Draw the sphere
  const drawSphere = (ctx, k, ambient) => {
    const imageData = ctx.createImageData(400, 400);
    const { data } = imageData;

    for (let i = 0; i < 400; i++) {
      for (let j = 0; j < 400; j++) {
        const x = j;
        const y = i;

        const posHit = hitSphere(posSphere, x, y);
        const negHit = hitSphere(negSphere, x, y);

        if (!posHit) continue;

        const [zb1, zb2] = posHit;
        const zs1 = negHit ? negHit[0] : null;
        const zs2 = negHit ? negHit[1] : null;

        let hitResult = 1; // Default to positive sphere
        if (!negHit || zs1 > zb1) hitResult = 1;
        else if (zs2 > zb2) hitResult = 0;
        else if (zs2 > zb1) hitResult = 2;

        let vec;
        if (hitResult === 0) continue;
        else if (hitResult === 1) {
          vec = [x - posSphere.cx, y - posSphere.cy, zb1 - posSphere.cz];
        } else {
          vec = [negSphere.cx - x, negSphere.cy - y, negSphere.cz - zs2];
        }

        normalize(vec);
        const brightness = Math.pow(dot(light, vec), k) + ambient;
        const intensity = Math.max(0, Math.min(1, brightness));

        // Calculate pixel index
        const index = (i * 400 + j) * 4;
        const color = Math.floor(intensity * 255);

        // Set RGBA values
        data[index] = color; // Red
        data[index + 1] = color; // Green
        data[index + 2] = color; // Blue
        data[index + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    let angle = 0;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const render = () => {
      ctx.clearRect(0, 0, 400, 400);

      // Rotate light
      light[1] = Math.cos(angle * 2);
      light[2] = Math.cos(angle);
      light[0] = Math.sin(angle);
      normalize(light);

      // Draw the sphere
      drawSphere(ctx, 2, 0.3);

      angle += 0.05;
    };

    const interval = setInterval(render, 100);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <canvas ref={canvasRef} width={400} height={400} />;
};

export default DeathStar;


//this code renders the Death Star using ASCII characters
/*import React, { useEffect, useRef } from "react";

const DeathStar = () => {
  const shades = ".:!*oe&#%@";
  const light = [-50, 0, 50]; // Light source position
  const posSphere = { cx: 20, cy: 20, cz: 0, r: 20 }; // Positive sphere
  const negSphere = { cx: 1, cy: 1, cz: -6, r: 20 }; // Negative sphere

  // Normalize a vector
  const normalize = (v) => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    v[0] /= len;
    v[1] /= len;
    v[2] /= len;
  };

  // Dot product of two vectors
  const dot = (x, y) => Math.max(0, x[0] * y[0] + x[1] * y[1] + x[2] * y[2]);

  // Check if a ray hits a sphere
  const hitSphere = (sphere, x, y) => {
    const dx = x - sphere.cx;
    const dy = y - sphere.cy;
    const zSq = sphere.r * sphere.r - (dx * dx + dy * dy);
    if (zSq < 0) return null;
    const z = Math.sqrt(zSq);
    return [sphere.cz - z, sphere.cz + z];
  };

  // Draw the sphere
  const drawSphere = (k, ambient) => {
    const output = [];
    for (let i = Math.floor(posSphere.cy - posSphere.r); i <= Math.ceil(posSphere.cy + posSphere.r); i++) {
      const row = [];
      const y = i + 0.5;
      for (let j = Math.floor(posSphere.cx - 2 * posSphere.r); j <= Math.ceil(posSphere.cx + 2 * posSphere.r); j++) {
        const x = (j - posSphere.cx) / 2 + 0.5 + posSphere.cx;
        const posHit = hitSphere(posSphere, x, y);
        const negHit = hitSphere(negSphere, x, y);

        if (!posHit) {
          row.push("+");
          continue;
        }

        const [zb1, zb2] = posHit;
        const zs1 = negHit ? negHit[0] : null;
        const zs2 = negHit ? negHit[1] : null;

        let hitResult = 1; // Default to positive sphere
        if (!negHit || zs1 > zb1) hitResult = 1;
        else if (zs2 > zb2) hitResult = 0;
        else if (zs2 > zb1) hitResult = 2;

        let vec;
        if (hitResult === 0) {
          row.push("+");
          continue;
        } else if (hitResult === 1) {
          vec = [x - posSphere.cx, y - posSphere.cy, zb1 - posSphere.cz];
        } else {
          vec = [negSphere.cx - x, negSphere.cy - y, negSphere.cz - zs2];
        }

        normalize(vec);
        const brightness = Math.pow(dot(light, vec), k) + ambient;
        const intensity = Math.max(
          0,
          Math.min(Math.floor((1 - brightness) * (shades.length - 1)), shades.length - 2)
        );
        row.push(shades[intensity]);
      }
      output.push(row.join(""));
    }
    return output.join("\n");
  };

  const outputRef = useRef(null);

  useEffect(() => {
    let angle = 0;

    const render = () => {
      // Rotate light
      light[1] = Math.cos(angle * 2);
      light[2] = Math.cos(angle);
      light[0] = Math.sin(angle);
      normalize(light);

      // Draw the sphere
      const asciiArt = drawSphere(2, 0.3);
      if (outputRef.current) {
        outputRef.current.textContent = asciiArt;
      }

      angle += 0.05;
    };

    const interval = setInterval(render, 100);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <pre
      ref={outputRef}
      style={{
        fontFamily: "monospace",
        lineHeight: "10px",
        whiteSpace: "pre",
        backgroundColor: "black",
        color: "white",
        padding: "10px",
        textAlign: "center",
      }}
    ></pre>
  );
};

export default DeathStar;*/

//this the code for the 2D canvas only
/*import React, { useEffect, useRef } from "react";

const DeathStar = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fill the canvas with a dark gray background
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, 250, 250);

    // Create radial gradient for large base circle
    let grd = ctx.createRadialGradient(225, 175, 190, 225, 150, 130);
    grd.addColorStop(0, "#EEEEEE");
    grd.addColorStop(1, "black");
    ctx.fillStyle = grd;

    // Apply gradient and fill circle
    ctx.beginPath();
    ctx.arc(125, 125, 105, 0, 2 * Math.PI);
    ctx.fill();

    // Create linear gradient for small inner circle
    grd = ctx.createLinearGradient(75, 90, 102, 90);
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "gray");
    ctx.fillStyle = grd;

    // Apply gradient and fill circle
    ctx.beginPath();
    ctx.arc(90, 90, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Add another small circle on top of the previous one to enhance the "shadow"
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(80, 90, 17, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="250"
      height="250"
      style={{ display: "block", margin: "0 auto", border: "1px solid #000" }}
    ></canvas>
  );
};

export default DeathStar;*/

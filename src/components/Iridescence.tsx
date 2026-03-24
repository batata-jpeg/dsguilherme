import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import "./Iridescence.css";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

export type IridescenceProps = {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  useGlobalPointer?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1,
  amplitude = 0.1,
  mouseReact = true,
  useGlobalPointer = false,
  className = "",
  style,
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      webgl: 1,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      depth: false,
    });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(color) },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / Math.max(gl.canvas.height, 1)),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const w = Math.max(1, Math.floor(ctn.clientWidth));
      const h = Math.max(1, Math.floor(ctn.clientHeight));
      renderer.setSize(w, h);
      const res = program.uniforms.uResolution.value as Color;
      res[0] = gl.canvas.width;
      res[1] = gl.canvas.height;
      res[2] = gl.canvas.width / Math.max(gl.canvas.height, 1);
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(ctn);

    let raf = 0;
    const loop = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    ctn.appendChild(gl.canvas);

    const applyMouse = (clientX: number, clientY: number) => {
      const rect = ctn.getBoundingClientRect();
      const x = (clientX - rect.left) / Math.max(rect.width, 1);
      const y = 1 - (clientY - rect.top) / Math.max(rect.height, 1);
      mousePos.current = { x, y };
      const arr = program.uniforms.uMouse.value as Float32Array;
      arr[0] = x;
      arr[1] = y;
    };

    const handleMouseMove = (e: MouseEvent) => applyMouse(e.clientX, e.clientY);

    if (mouseReact) {
      if (useGlobalPointer) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
      } else {
        ctn.addEventListener("mousemove", handleMouseMove);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseReact) {
        if (useGlobalPointer) window.removeEventListener("mousemove", handleMouseMove);
        else ctn.removeEventListener("mousemove", handleMouseMove);
      }
      program.remove();
      geometry.remove();
      try {
        ctn.removeChild(gl.canvas);
      } catch {
        /* ignore */
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact, useGlobalPointer]);

  return (
    <div
      ref={ctnDom}
      className={`iridescence-container ${className}`.trim()}
      style={style}
      aria-hidden
    />
  );
}

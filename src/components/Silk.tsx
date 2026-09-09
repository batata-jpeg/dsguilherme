// A slow silk/moiré shader, used as a texture *over* the site's background
// gradient rather than as the background itself. See SiteBackground.tsx for how
// it is layered and why.
//
// The shader body is kept verbatim from the original snippet. Everything around
// it is adapted for this site: typed, DPR-capped, and paused when the tab is
// hidden or the visitor asked for reduced motion, because this canvas lives on
// every page and has to share the GPU with the Projects book and the 3D viewer.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useLayoutEffect, useEffect, useState } from "react";
import { Color, Mesh, ShaderMaterial, type IUniform } from "three";

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);
if (uLightMode > 0.5) {
  float fold = smoothstep(0.28, 0.9, pattern);
  float specular = smoothstep(0.72, 0.98, pattern);
  vec3 shadowColor = uColor * 0.72;
  vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
  vec3 lightBase = mix(shadowColor, bodyColor, fold);
  lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
  float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
  float grainSignal = (rnd + fineNoise - 1.0);
  float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
  result = lightBase + grainSignal * grainStrength;
}
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

type SilkUniforms = {
  uSpeed: IUniform<number>;
  uScale: IUniform<number>;
  uNoiseIntensity: IUniform<number>;
  uColor: IUniform<Color>;
  uRotation: IUniform<number>;
  uLightMode: IUniform<number>;
  uTime: IUniform<number>;
};

const SilkPlane = forwardRef<Mesh, { uniforms: SilkUniforms; animate: boolean }>(
  function SilkPlane({ uniforms, animate }, ref) {
    const { viewport } = useThree();

    useLayoutEffect(() => {
      const mesh = (ref as React.RefObject<Mesh>)?.current;
      if (mesh) mesh.scale.set(viewport.width, viewport.height, 1);
    }, [ref, viewport]);

    useFrame((_, delta) => {
      if (!animate) return;
      const mesh = (ref as React.RefObject<Mesh>)?.current;
      if (!mesh) return;
      (mesh.material as ShaderMaterial).uniforms.uTime.value += 0.1 * delta;
    });

    return (
      <mesh ref={ref}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </mesh>
    );
  }
);

export type SilkProps = {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  lightMode?: boolean;
  /** false renders a single still frame instead of running the loop. */
  animate?: boolean;
  /** Upper bound on device pixel ratio. The pattern is soft, so 1 is plenty. */
  maxDpr?: number;
};

export default function Silk({
  speed = 5,
  scale = 1,
  color = "#7B7481",
  noiseIntensity = 1.5,
  rotation = 0,
  lightMode = false,
  animate = true,
  maxDpr = 1,
}: SilkProps) {
  const meshRef = useRef<Mesh>(null);

  // Built once and mutated in place below. Handing `shaderMaterial` a new
  // uniforms object on every render would rebuild the program each time.
  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uLightMode: { value: lightMode ? 1 : 0 },
      uTime: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color));
    uniforms.uRotation.value = rotation;
    uniforms.uLightMode.value = lightMode ? 1 : 0;
  }, [speed, scale, noiseIntensity, color, rotation, lightMode, uniforms]);

  // A background nobody is looking at should not be burning a GPU. Backgrounded
  // tabs already throttle rAF, but this drops the loop outright.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  const running = animate && visible;

  return (
    <Canvas
      dpr={[1, maxDpr]}
      // "demand" still paints the first frame, so a paused canvas shows the
      // texture standing still rather than going blank.
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: false, powerPreference: "low-power", alpha: false }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} animate={running} />
    </Canvas>
  );
}

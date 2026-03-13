import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const randomBetween = (min, max) => min + Math.random() * (max - min);
const mixChannel = (from, to, amount) => Math.round(from + (to - from) * amount);
const LINK_NEIGHBOR_OFFSETS = [
  [0, 0],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [1, -1],
];

const getPerformanceProfile = (viewportWidth, viewportHeight, coarsePointer) => {
  const deviceMemory = navigator.deviceMemory ?? 8;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const prefersSaveData = navigator.connection?.saveData === true;
  const compactViewport = viewportWidth < 768 || viewportHeight < 720;
  const lowPowerDevice = prefersSaveData || hardwareConcurrency <= 4 || deviceMemory <= 4;
  const lighterProfile = coarsePointer || compactViewport || lowPowerDevice;

  return {
    enableTrails: !lighterProfile || viewportWidth >= 1024,
    interactionFps: lighterProfile ? 28 : 42,
    maxDpr: lighterProfile ? 1.35 : 1.8,
    maxFps: lighterProfile ? 42 : 60,
    particleMultiplier: lighterProfile ? 0.72 : 1,
    dustMultiplier: lighterProfile ? 0.66 : 1,
  };
};

const createParticle = (width, height) => {
  const tone = Math.round(randomBetween(220, 255));
  const x = Math.random() * width;
  const y = Math.random() * height;
  const isAnchor = Math.random() < 0.22;

  return {
    x,
    y,
    homeX: x,
    homeY: y,
    prevX: x,
    prevY: y,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    baseVx: (Math.random() - 0.5) * 0.18,
    baseVy: (Math.random() - 0.5) * 0.18,
    radius: randomBetween(1.05, 2.7),
    alpha: randomBetween(0.46, 0.82),
    pulseRate: randomBetween(0.0007, 0.00125),
    phase: Math.random() * Math.PI * 2,
    tone,
    disturbance: 0,
    returnStrength: isAnchor
      ? randomBetween(0.0034, 0.0058)
      : randomBetween(0.0014, 0.0031),
    isAnchor,
  };
};

const createDustStar = (width, height) => {
  const tone = Math.round(randomBetween(182, 246));

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: randomBetween(0.35, 1.3),
    alpha: randomBetween(0.1, 0.36),
    pulseRate: randomBetween(0.00018, 0.00038),
    phase: Math.random() * Math.PI * 2,
    tone,
  };
};

export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    let reduceMotion = motionQuery.matches;
    let animationFrame = 0;
    let resizeFrame = 0;
    let lastFrameTime = 0;
    let interactionBoostUntil = 0;
    let width = 0;
    let height = 0;
    let particles = [];
    let dustStars = [];
    let performanceProfile = getPerformanceProfile(
      window.innerWidth,
      window.innerHeight,
      coarsePointerQuery.matches,
    );
    const pointer = {
      x: 0,
      y: 0,
      renderX: 0,
      renderY: 0,
      pushX: 0,
      pushY: 0,
      speed: 0,
      active: false,
      glow: 0,
      effectRadius: 176,
      glowRadius: 500,
      ringRadius: 52,
    };

    const markInteraction = () => {
      interactionBoostUntil = performance.now() + 180;
      queueFrame();
    };

    const getLanternInfluence = (x, y) => {
      if (pointer.glow <= 0.02) {
        return 0;
      }

      const lanternRadius = pointer.glowRadius * 0.82;
      const sourceX = pointer.active ? pointer.x : pointer.renderX;
      const sourceY = pointer.active ? pointer.y : pointer.renderY;

      return (
        Math.max(0, 1 - Math.hypot(x - sourceX, y - sourceY) / lanternRadius) *
        pointer.glow
      );
    };

    const getStarColor = (baseTone, influence) => {
      const tint = clamp(influence, 0, 1);

      return {
        r: mixChannel(baseTone, 131, tint * 0.92),
        g: mixChannel(baseTone, 255, tint),
        b: mixChannel(baseTone, 195, tint * 0.9),
      };
    };

    const getLinkColor = (influence) => {
      const tint = clamp(influence, 0, 1);

      return {
        r: mixChannel(120, 131, tint),
        g: mixChannel(126, 255, tint),
        b: mixChannel(132, 195, tint * 0.92),
      };
    };

    const drawDustStars = (time) => {
      for (let index = 0; index < dustStars.length; index += 1) {
        const star = dustStars[index];
        const lanternInfluence = getLanternInfluence(star.x, star.y);
        const pulse = reduceMotion
          ? 0.5
          : (Math.sin(time * star.pulseRate + star.phase) + 1) * 0.5;
        const alpha = star.alpha * 0.2 + pulse * 0.04 + lanternInfluence * 0.36;
        const color = getStarColor(star.tone, lanternInfluence);

        context.beginPath();
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawLantern = () => {
      if (pointer.glow <= 0.02) {
        return;
      }

      const gradient = context.createRadialGradient(
        pointer.renderX,
        pointer.renderY,
        pointer.ringRadius * 0.35,
        pointer.renderX,
        pointer.renderY,
        pointer.glowRadius,
      );

      gradient.addColorStop(0, `rgba(126, 255, 180, ${0.18 * pointer.glow})`);
      gradient.addColorStop(0.2, `rgba(84, 255, 145, ${0.13 * pointer.glow})`);
      gradient.addColorStop(0.52, `rgba(33, 120, 67, ${0.07 * pointer.glow})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.beginPath();
      context.fillStyle = gradient;
      context.arc(pointer.renderX, pointer.renderY, pointer.glowRadius, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.strokeStyle = `rgba(131, 255, 195, ${0.26 * pointer.glow})`;
      context.lineWidth = 1;
      context.arc(pointer.renderX, pointer.renderY, pointer.ringRadius, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.fillStyle = `rgba(145, 255, 202, ${0.38 * pointer.glow})`;
      context.arc(pointer.renderX, pointer.renderY, 3, 0, Math.PI * 2);
      context.fill();
    };

    const drawTrails = () => {
      if (!performanceProfile.enableTrails) {
        return;
      }

      context.lineCap = "round";

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const travel = Math.hypot(particle.x - particle.prevX, particle.y - particle.prevY);
        const trailStrength = clamp(particle.disturbance * 0.78 + travel * 0.22, 0, 1.15);

        if (trailStrength < 0.08) {
          continue;
        }

        const lanternInfluence = getLanternInfluence(
          (particle.x + particle.prevX) * 0.5,
          (particle.y + particle.prevY) * 0.5,
        );
        const color = getStarColor(particle.tone, lanternInfluence);

        context.beginPath();
        context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.min(0.26, trailStrength * 0.1 + lanternInfluence * 0.18)})`;
        context.lineWidth = Math.max(0.45, particle.radius * 0.42);
        context.moveTo(particle.prevX, particle.prevY);
        context.lineTo(particle.x, particle.y);
        context.stroke();
      }
    };

    const drawLinks = (linkDistance) => {
      const cellSize = linkDistance;
      const particleGrid = new Map();

      context.lineCap = "round";

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const cellX = Math.floor(particle.x / cellSize);
        const cellY = Math.floor(particle.y / cellSize);

        for (let offsetIndex = 0; offsetIndex < LINK_NEIGHBOR_OFFSETS.length; offsetIndex += 1) {
          const offset = LINK_NEIGHBOR_OFFSETS[offsetIndex];
          const key = `${cellX + offset[0]}:${cellY + offset[1]}`;
          const nearbyParticles = particleGrid.get(key);

          if (!nearbyParticles) {
            continue;
          }

          for (let nearbyIndex = 0; nearbyIndex < nearbyParticles.length; nearbyIndex += 1) {
            const other = particles[nearbyParticles[nearbyIndex]];
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.hypot(dx, dy);

            if (distance > linkDistance) {
              continue;
            }

            const strength = 1 - distance / linkDistance;
            const midpointX = (particle.x + other.x) / 2;
            const midpointY = (particle.y + other.y) / 2;
            const lanternInfluence = getLanternInfluence(midpointX, midpointY);
            const linkColor = getLinkColor(lanternInfluence);

            context.beginPath();
            context.strokeStyle = `rgba(${linkColor.r}, ${linkColor.g}, ${linkColor.b}, ${strength * 0.11 + lanternInfluence * 0.32})`;
            context.lineWidth = strength > 0.66 ? 1 : 0.78;
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        const gridKey = `${cellX}:${cellY}`;
        const bucket = particleGrid.get(gridKey);

        if (bucket) {
          bucket.push(index);
        } else {
          particleGrid.set(gridKey, [index]);
        }
      }
    };

    const draw = (time) => {
      if (!width || !height) {
        return;
      }

      const linkDistance = width < 768 ? 124 : 152;
      const pointerDistance = Math.hypot(pointer.x - pointer.renderX, pointer.y - pointer.renderY);
      const followStrength = clamp(0.42 + pointerDistance / 460, 0.42, 0.72);
      pointer.renderX += (pointer.x - pointer.renderX) * followStrength;
      pointer.renderY += (pointer.y - pointer.renderY) * followStrength;
      pointer.pushX *= 0.88;
      pointer.pushY *= 0.88;
      pointer.speed *= 0.9;
      pointer.glow += ((pointer.active ? 1 : 0) - pointer.glow) * 0.16;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);

      drawDustStars(time);
      drawLantern();

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        particle.prevX = particle.x;
        particle.prevY = particle.y;

        if (!reduceMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx += (particle.baseVx - particle.vx) * 0.016;
          particle.vy += (particle.baseVy - particle.vy) * 0.016;

          const homeDx = particle.homeX - particle.x;
          const homeDy = particle.homeY - particle.y;
          const homeDistance = Math.hypot(homeDx, homeDy);
          const returnFactor = clamp(1 - particle.disturbance * 0.55, 0.28, 1);

          if (homeDistance > 0.2) {
            particle.vx += homeDx * particle.returnStrength * returnFactor;
            particle.vy += homeDy * particle.returnStrength * returnFactor;
          }

          if (pointer.glow > 0.02) {
            const dx = particle.x - pointer.renderX;
            const dy = particle.y - pointer.renderY;
            const distance = Math.hypot(dx, dy) || 1;

            if (distance < pointer.effectRadius) {
              const outerBand = Math.max(pointer.effectRadius - pointer.ringRadius, 1);
              const approachDistance = Math.max(0, distance - pointer.ringRadius);
              const fear = 1 - approachDistance / outerBand;
              const panic = fear * fear;
              const directionX = dx / distance;
              const directionY = dy / distance;
              const directionalPush = clamp(pointer.speed / 12, 0, 3.2);

              particle.x += directionX * fear * (6.1 + directionalPush * 1.15);
              particle.y += directionY * fear * (6.1 + directionalPush * 1.15);
              particle.vx += directionX * (0.16 + panic * 0.16);
              particle.vy += directionY * (0.16 + panic * 0.16);
              particle.vx += pointer.pushX * 0.028 * fear;
              particle.vy += pointer.pushY * 0.028 * fear;
              particle.vx += (Math.random() - 0.5) * 0.05 * fear;
              particle.vy += (Math.random() - 0.5) * 0.05 * fear;
              particle.disturbance = clamp(
                Math.max(particle.disturbance, 0.38 + fear * 1.24 + directionalPush * 0.1),
                0,
                1.55,
              );
            }
          }

          particle.disturbance *= 0.93;
          particle.vx = clamp(particle.vx, -0.96, 0.96);
          particle.vy = clamp(particle.vy, -0.96, 0.96);

          if (particle.x < -20 || particle.x > width + 20) {
            particle.vx *= -1;
          }

          if (particle.y < -20 || particle.y > height + 20) {
            particle.vy *= -1;
          }

          particle.x = clamp(particle.x, -12, width + 12);
          particle.y = clamp(particle.y, -12, height + 12);
        }
      }

      drawTrails();
      drawLinks(linkDistance);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const lanternInfluence = getLanternInfluence(particle.x, particle.y);
        const pulse = reduceMotion
          ? 0.5
          : (Math.sin(time * particle.pulseRate + particle.phase) + 1) * 0.5;
        const radius =
          particle.radius +
          (particle.isAnchor ? 0.18 : 0) +
          pulse * 0.1 +
          lanternInfluence * 0.85;
        const alpha =
          particle.alpha * 0.24 +
          pulse * 0.05 +
          particle.disturbance * 0.06 +
          lanternInfluence * 0.42;
        const color = getStarColor(particle.tone, lanternInfluence);

        context.beginPath();
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const queueFrame = () => {
      if (animationFrame || document.hidden) {
        return;
      }

      animationFrame = window.requestAnimationFrame((time) => {
        animationFrame = 0;

        const targetFps =
          time < interactionBoostUntil
            ? performanceProfile.interactionFps
            : performanceProfile.maxFps;
        const frameInterval = 1000 / targetFps;

        if (
          reduceMotion ||
          lastFrameTime === 0 ||
          time - lastFrameTime >= frameInterval - 1
        ) {
          lastFrameTime = time;
          draw(time);
        }

        if (!reduceMotion) {
          queueFrame();
        }
      });
    };

    const resetStarfield = () => {
      const area = width * height;
      const particleDensity = width < 768 ? 11600 : 9000;
      const dustDensity = width < 768 ? 5600 : 4400;
      const particleCount = Math.round(
        clamp((area / particleDensity) * performanceProfile.particleMultiplier, 48, 190),
      );
      const dustCount = Math.round(
        clamp((area / dustDensity) * performanceProfile.dustMultiplier, 120, 360),
      );

      particles = Array.from({ length: particleCount }, () => createParticle(width, height));
      dustStars = Array.from({ length: dustCount }, () => createDustStar(width, height));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      performanceProfile = getPerformanceProfile(width, height, coarsePointerQuery.matches);
      const dpr = Math.min(window.devicePixelRatio || 1, performanceProfile.maxDpr);
      pointer.glowRadius = width < 768 ? 340 : 500;
      pointer.ringRadius = width < 768 ? 34 : 52;
      pointer.effectRadius = pointer.ringRadius * 3.4;
      pointer.x = clamp(pointer.x || width / 2, 0, width);
      pointer.y = clamp(pointer.y || height / 2, 0, height);
      pointer.renderX = clamp(pointer.renderX || pointer.x, 0, width);
      pointer.renderY = clamp(pointer.renderY || pointer.y, 0, height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastFrameTime = 0;
      resetStarfield();
      queueFrame();
    };

    const queueResize = () => {
      if (resizeFrame) {
        return;
      }

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    const handlePointerMove = (event) => {
      if (reduceMotion) {
        return;
      }

      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.pushX = clamp(dx, -28, 28);
      pointer.pushY = clamp(dy, -28, 28);
      pointer.speed = clamp(Math.hypot(dx, dy), 0, 42);
      pointer.active = true;
      queueFrame();
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      if (!reduceMotion) {
        queueFrame();
      }
    };

    const handleMotionChange = (event) => {
      reduceMotion = event.matches;
      pointer.active = false;
      pointer.pushX = 0;
      pointer.pushY = 0;
      pointer.speed = 0;
      lastFrameTime = 0;

      if (!reduceMotion) {
        queueFrame();
        return;
      }

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }

      queueFrame();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }

        return;
      }

      lastFrameTime = 0;
      queueFrame();
    };

    resize();
    motionQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", queueResize);
    window.addEventListener("scroll", markInteraction, { capture: true, passive: true });
    window.addEventListener("wheel", markInteraction, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerLeave);
    window.addEventListener("pointercancel", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", queueResize);
      window.removeEventListener("scroll", markInteraction, true);
      window.removeEventListener("wheel", markInteraction);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerLeave);
      window.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      <canvas className="absolute inset-0 block h-full w-full opacity-100" ref={canvasRef} />
    </div>
  );
}

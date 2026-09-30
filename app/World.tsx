"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type SceneState = { progress: number; flavour: number; reduced: boolean; light: boolean };
const smooth = THREE.MathUtils.smoothstep;
const lerp = THREE.MathUtils.lerp;

/** One renderer and one product group across all chapters. Replace the plane
 * inside product with a GLTFLoader model without changing the camera timeline. */
export default function World({ state, onProgress }: { state: React.RefObject<SceneState>; onProgress: (n: number) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch { setFallback(true); onProgress(100); return; }
    const mount = host.current;
    mount.appendChild(renderer.domElement);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    let mobile = innerWidth < 760;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
    camera.position.z = 11;
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_, loaded, total) => onProgress(Math.round(loaded / total * 100));
    const loader = new THREE.TextureLoader(manager);
    const cupTextures = ['/cup.webp', '/caramel.webp', '/mocha.webp'].map(url => {
      const texture = loader.load(url); texture.colorSpace = THREE.SRGBColorSpace; return texture;
    });
    const berryTexture = loader.load('/strawberry.webp');
    berryTexture.colorSpace = THREE.SRGBColorSpace;
    // Count real image completions; no fabricated percentage timer.
    for (const source of ['/menu-table.webp', '/interior.webp']) {
      manager.itemStart(source);
      const img = new Image();
      img.onload = img.onerror = () => manager.itemEnd(source);
      img.src = source;
    }
    const cupMaterial = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { map: { value: cupTextures[0] }, nextMap: { value: cupTextures[0] }, blend: { value: 1 }, opacity: { value: 1 }, time: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv; vec3 p=position; p.z+=sin(uv.x*3.14159)*.08; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader: `uniform sampler2D map; uniform sampler2D nextMap; uniform float blend; uniform float opacity; uniform float time; varying vec2 vUv;
        void main(){ vec4 c=mix(texture2D(map,vUv),texture2D(nextMap,vUv),smoothstep(0.,1.,blend));
        float glint=pow(max(0.,1.-abs(vUv.x-(.45+sin(time*.35)*.12))*8.),8.)*.015;
        c.rgb+=glint*step(.95,c.a); gl_FragColor=vec4(c.rgb,c.a*opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
    });
    const product = new THREE.Group();
    const cup = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 6.6, 24, 24), cupMaterial);
    product.add(cup); scene.add(product);
    // Thin spatial ribbons orbit the product, with travelling points of light.
    const orbit = new THREE.Group(); scene.add(orbit);
    const ribbonMaterials: THREE.LineBasicMaterial[] = [];
    for (let ring = 0; ring < 3; ring++) {
      const vertices = Array.from({ length: 161 }, (_, i) => {
        const angle = i / 160 * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * (2.15 + ring * .16), Math.sin(angle) * (2.15 + ring * .16), 0);
      });
      const material = new THREE.LineBasicMaterial({ color: '#f46b76', transparent: true, opacity: .2, depthWrite: false });
      ribbonMaterials.push(material);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vertices), material);
      line.rotation.set(1.12 + ring * .18, .22 + ring * .16, -.25); orbit.add(line);
    }
    const droplets = new THREE.Group(); scene.add(droplets);
    const dropGeometry = new THREE.SphereGeometry(.035, 10, 8);
    const dropMaterial = new THREE.MeshPhysicalMaterial({ color: '#ffe2dc', metalness: .2, roughness: .13, transparent: true, opacity: .65 });
    for (let i = 0; i < 18; i++) { const mesh = new THREE.Mesh(dropGeometry, dropMaterial); mesh.scale.setScalar(.6 + (i % 4) * .3); droplets.add(mesh); }
    scene.add(new THREE.HemisphereLight('#fff5eb', '#4b1524', 3));
    const keyLight = new THREE.PointLight('#fff6e8', 35); keyLight.position.set(3, 4, 5); scene.add(keyLight);
    // Photographic berries only. No procedural fruit, cubes or marshmallow shapes.
    const berryMaterial = new THREE.MeshBasicMaterial({ map: berryTexture, transparent: true, depthWrite: false, opacity: 0, toneMapped: false });
    const berries = [0, 1, 2].map(i => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(.72, .68), berryMaterial.clone());
      mesh.rotation.z = [-.35, .6, -.7][i]; scene.add(mesh); return mesh;
    });
    const count = 70, points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { points[i * 3] = Math.sin(i * 18.13) * 5; points[i * 3 + 1] = Math.cos(i * 27.17) * 3.8; points[i * 3 + 2] = -2 - (i % 5) * .3; }
    const dustGeometry = new THREE.BufferGeometry(); dustGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const dustMaterial = new THREE.PointsMaterial({ color: '#d8c5b9', size: .012, transparent: true, opacity: .19, depthWrite: false });
    const dust = new THREE.Points(dustGeometry, dustMaterial); scene.add(dust);
    const pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
    const move = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; pointer.x = event.clientX / innerWidth * 2 - 1; pointer.y = event.clientY / innerHeight * 2 - 1; };
    window.addEventListener('pointermove', move, { passive: true });
    const resize = () => {
      mobile = innerWidth < 760;
      renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.35 : 1.75));
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    };
    resize(); window.addEventListener('resize', resize);
    const lost = (event: Event) => { event.preventDefault(); setFallback(true); };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    const palette = ['#ff7783', '#e7b367', '#bb8061'].map(color => new THREE.Color(color));
    const clock = new THREE.Clock(); let frameId = 0, displayedFlavour = 0;
    function draw() {
      frameId = requestAnimationFrame(draw);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), .05), time = clock.elapsedTime;
      const { progress, flavour, reduced, light } = state.current;
      const p = progress * 6, idle = reduced ? 0 : time;
      const activeFlavour = p > .55 && p < 1.45 ? 0 : flavour;
      const ingredient = smooth(p, .3, 1), exit = smooth(p, 2.35, 2.95), final = smooth(p, 5.2, 5.85);
      const damp = 1 - Math.exp(-dt * 4);
      eased.x = lerp(eased.x, reduced ? 0 : pointer.x, damp); eased.y = lerp(eased.y, reduced ? 0 : pointer.y, damp);
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * 11;
      const viewWidth = viewHeight * camera.aspect;
      product.position.x = lerp(mobile ? viewWidth * .17 : viewWidth * (.245 - Math.sin(Math.min(p, 2) * Math.PI / 2) * .035), mobile ? 0 : viewWidth * .23, final);
      product.position.y = (mobile ? lerp(.68, -.18, final) : -.05) + Math.sin(idle * .9) * .20 + eased.y * -.045;
      if (mobile && p > .5 && p < 2.8) product.position.y -= smooth(p, .4, .95) * 2.25;
      product.rotation.z = -.08 + ingredient * .08 + Math.sin(idle * .65) * .11 + eased.x * .035 - final * .06;
      product.rotation.y = Math.sin(idle * .6) * .30 + eased.x * .12 + Math.sin(p * 1.4) * .14;
      product.rotation.x = Math.cos(idle * .6) * .055;
      const short = innerHeight < 650;
      const scale = mobile ? lerp(lerp(short ? .43 : .59, .40, smooth(p, .4, .95)), .41, final) : (short ? .77 : .88);
      product.scale.setScalar(scale * (1 + Math.sin(Math.min(p, 2) * Math.PI / 2) * .10));
      cupMaterial.uniforms.opacity.value = 1 - exit + final;
      if (displayedFlavour !== activeFlavour) {
        cupMaterial.uniforms.map.value = cupTextures[displayedFlavour];
        cupMaterial.uniforms.nextMap.value = cupTextures[activeFlavour];
        cupMaterial.uniforms.blend.value = 0; displayedFlavour = activeFlavour;
      }
      cupMaterial.uniforms.blend.value = Math.min(1, cupMaterial.uniforms.blend.value + dt * 1.6);
      cupMaterial.uniforms.time.value = idle;
      const worldVisibility = Math.max(1 - exit, final);
      orbit.position.copy(product.position); orbit.position.z = -1;
      orbit.scale.setScalar(mobile ? .65 : 1);
      orbit.rotation.z = idle * .09 + p * .45;
      const atmosphereColor = palette[activeFlavour];
      ribbonMaterials.forEach(material => { material.color.lerp(atmosphereColor, damp); material.opacity = (light ? .26 : .32) * worldVisibility; });
      droplets.children.forEach((drop, i) => {
        const angle = idle * (.12 + i % 3 * .02) + i * 2.4 + p * .8;
        const radius = (mobile ? 1.05 : 1.9) + Math.sin(i * 4) * .45;
        drop.position.set(product.position.x + Math.cos(angle) * radius, product.position.y + Math.sin(angle) * radius * 1.25, -.8 + Math.sin(angle) * .5);
      });
      dropMaterial.opacity = worldVisibility * (light ? .45 : .8);
      const berryOpacity = (1 - exit) * (activeFlavour === 0 ? 1 : 0) * (1 - final);
      berries.forEach((berry, i) => {
        const angles = [-1.15, .8, 2.5], angle = angles[i] + idle * .12 + ingredient * .7;
        const radius = (mobile ? 1.1 : 1.65) + Math.sin(p * 1.2) * .22;
        berry.position.set(product.position.x + Math.cos(angle) * radius, product.position.y + Math.sin(angle) * radius, -.6 - i * .28);
        // Keep every ingredient in the product half, never through text.
        if (!mobile) berry.position.x = Math.max(viewWidth * .06, berry.position.x);
        berry.rotation.z = angles[i] * .3 + Math.sin(idle * .35 + i) * .07;
        berry.scale.setScalar((mobile ? .45 : .68) + (i === 2 ? .18 : 0));
        (berry.material as THREE.MeshBasicMaterial).opacity = berryOpacity * (i === 2 ? .7 : .95);
      });
      dust.rotation.z = Math.sin(idle * .035) * .1 + p * .025;
      dustMaterial.opacity = light ? .035 : .14 * (1 - smooth(p, 3.4, 4));
      camera.position.x = eased.x * .065; camera.position.y = -eased.y * .045; camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    draw();
    return () => {
      cancelAnimationFrame(frameId); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Line) { object.geometry.dispose(); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose()); } });
      cupTextures.forEach(texture => texture.dispose()); berryTexture.dispose(); berryMaterial.dispose(); dustGeometry.dispose(); dustMaterial.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [state, onProgress]);
  return <div className="webgl" ref={host} aria-hidden="true">{fallback && <img className="fallback-cup" src="/cup.webp" alt="" />}</div>;
}

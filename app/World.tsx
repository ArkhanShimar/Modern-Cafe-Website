"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
export type SceneState = {progress:number; flavour:number; reduced:boolean};
// Product lives in a single group: replace the billboard with a GLTFLoader model here.
export default function World({state,onProgress}:{state:React.RefObject<SceneState>;onProgress:(n:number)=>void}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!host.current)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:innerWidth>700,powerPreference:'high-performance'});}catch{onProgress(100);return;}
  let mobile=innerWidth<700;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.75));host.current.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,80);camera.position.z=11;
  const manager=new THREE.LoadingManager();manager.onProgress=(_,loaded,total)=>onProgress(Math.round(loaded/total*100));manager.onError=()=>onProgress(100);
  manager.itemStart('campaign');const campaign=new Image();campaign.onload=campaign.onerror=()=>manager.itemEnd('campaign');campaign.src='/cafe.png';
  const texture=new THREE.TextureLoader(manager).load('/cup.png');texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{map:{value:texture},flavour:{value:0},opacity:{value:1}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D map;uniform float flavour;uniform float opacity;varying vec2 vUv;void main(){vec4 c=texture2D(map,vUv);float mask=smoothstep(.02,.2,c.r-c.g)*smoothstep(.08,.3,c.r);float l=dot(c.rgb,vec3(.3,.59,.11));vec3 caramel=vec3(l*1.12,l*.78,l*.43);vec3 mocha=vec3(l*.53,l*.30,l*.21);vec3 target=mix(caramel,mocha,clamp(flavour-1.,0.,1.));c.rgb=mix(c.rgb,target,mask*min(flavour,1.));gl_FragColor=vec4(c.rgb,c.a*opacity);}`});
  const product=new THREE.Group();const cup=new THREE.Mesh(new THREE.PlaneGeometry(4.4,6.6),material);product.add(cup);scene.add(product);
  scene.add(new THREE.AmbientLight('#ffded0',2));const light=new THREE.PointLight('#ffd4ad',60);light.position.set(3,4,5);scene.add(light);
  const ingredients=new THREE.Group();scene.add(ingredients);
  const objects:THREE.Mesh[]=[];const red=new THREE.MeshStandardMaterial({color:'#bb252b',roughness:.37});const cream=new THREE.MeshStandardMaterial({color:'#fff3df',roughness:.45});const ice=new THREE.MeshPhysicalMaterial({color:'#e6eef1',metalness:.15,roughness:.13,transparent:true,opacity:.48});
  const green=new THREE.MeshStandardMaterial({color:'#36552b',roughness:.7}),seedMat=new THREE.MeshStandardMaterial({color:'#edc38c',roughness:.7});
  for(let i=0;i<(mobile?12:25);i++){let geometry:THREE.BufferGeometry=i%3===0?new THREE.BoxGeometry(.16,.18,.15):new THREE.SphereGeometry(i%3===1?.17:.045,24,20);if(i%3===1){const attr=geometry.getAttribute('position');for(let j=0;j<attr.count;j++){const y=attr.getY(j);const taper=.7+(y/.17+1)*.17;attr.setXYZ(j,attr.getX(j)*taper,y*1.35,attr.getZ(j)*taper);}geometry.computeVertexNormals();}const m=new THREE.Mesh(geometry,i%3===0?ice:i%3===1?red:cream);if(i%3===1){for(let j=0;j<5;j++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),green);leaf.scale.set(.55,.12,1.8);leaf.position.set(Math.cos(j*1.256)*.045,.21,Math.sin(j*1.256)*.045);leaf.rotation.y=-j*1.256;m.add(leaf);}const seeds=new THREE.InstancedMesh(new THREE.SphereGeometry(.009,5,4),seedMat,30);const dummy=new THREE.Object3D();for(let j=0;j<30;j++){const y=1-2*(j+.5)/30,a=j*2.399,r=Math.sqrt(1-y*y),taper=.7+(y+1)*.17;dummy.position.set(Math.cos(a)*r*.175*taper,y*.232,Math.sin(a)*r*.175*taper);dummy.scale.set(.6,1,.5);dummy.updateMatrix();seeds.setMatrixAt(j,dummy.matrix);}m.add(seeds);}m.userData={angle:i*2.399,radius:1.4+(i%5)*.36,z:(i%7-3)*.5};objects.push(m);ingredients.add(m);}
  const craftGroup=new THREE.Group();scene.add(craftGroup);const beanMat=new THREE.MeshStandardMaterial({color:'#432417',roughness:.45});
  for(let i=0;i<(mobile?10:22);i++){const bean=new THREE.Mesh(new THREE.SphereGeometry(.16,20,12),beanMat);bean.scale.set(.7,1.25,.8);bean.position.set(Math.sin(i*2.4)*5,Math.cos(i*2.4)*3.4,(i%5)-2);bean.rotation.set(i,i*.7,i*.3);const crease=new THREE.Mesh(new THREE.TorusGeometry(.105,.013,5,16,Math.PI),new THREE.MeshStandardMaterial({color:'#170c07'}));crease.rotation.z=Math.PI/2;crease.scale.set(1.5,.35,1);crease.position.z=.13;bean.add(crease);craftGroup.add(bean);}
  const milkCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-5,-2,-3),new THREE.Vector3(-3,1,-2),new THREE.Vector3(0,2,-4),new THREE.Vector3(3,-1,-3),new THREE.Vector3(5,2,-2)]);const milk=new THREE.Mesh(new THREE.TubeGeometry(milkCurve,70,.035,7,false),cream);craftGroup.add(milk);
  const count=mobile?90:220,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=Math.sin(i*19.1)*10;positions[i*3+1]=Math.cos(i*27.7)*7;positions[i*3+2]=Math.sin(i*6.7)*7;}const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));const pm=new THREE.PointsMaterial({color:'#f1c6aa',size:.025,transparent:true,opacity:.45,depthWrite:false});const particles=new THREE.Points(pg,pm);scene.add(particles);
  const mouse={x:0,y:0};const pointer=(e:PointerEvent)=>{mouse.x=(e.clientX/innerWidth-.5)*2;mouse.y=(e.clientY/innerHeight-.5)*2;};window.addEventListener('pointermove',pointer,{passive:true});
  const resize=()=>{const w=innerWidth,h=innerHeight;mobile=w<700;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};resize();window.addEventListener('resize',resize);
  const clock=new THREE.Clock();let raf=0;
  const frame=()=>{raf=requestAnimationFrame(frame);if(document.hidden)return;const t=clock.getElapsedTime(),p=state.current.progress*6,idle=state.current.reduced?0:t;
   const hero=THREE.MathUtils.smoothstep(p,0,.7),craft=THREE.MathUtils.smoothstep(p,2.65,3.4),final=THREE.MathUtils.smoothstep(p,5.1,5.85);
   product.position.x=mobile?.65:THREE.MathUtils.lerp(2.6,2.1,hero);product.position.x=THREE.MathUtils.lerp(product.position.x,0,final);product.position.y=Math.sin(idle*.65)*.07-(mobile?THREE.MathUtils.lerp(1.1,.15,final):0);
   product.rotation.z=THREE.MathUtils.lerp(-.14,.1,hero)+Math.sin(idle*.3)*.018;product.rotation.y=Math.sin(p*2)*.12+mouse.x*.035;
   const scale=mobile?THREE.MathUtils.lerp(.52,.37,final): .88;product.scale.setScalar(scale*(1+Math.sin(Math.min(p,3)*1.2)*.07));
   material.uniforms.opacity.value=Math.min(hero*1.8,1)*(1-craft)*(1-THREE.MathUtils.smoothstep(p,2.55,3.1))+final;
   material.uniforms.flavour.value=THREE.MathUtils.lerp(material.uniforms.flavour.value,state.current.flavour,.055);
   red.color.lerp(new THREE.Color(state.current.flavour===0?'#bb252b':state.current.flavour===1?'#b87d3a':'#42251a'),.05);
   objects.forEach((m,i)=>{const d=m.userData,a=d.angle+p*1.8+idle*.06,r=d.radius*(1+Math.sin(Math.min(p,2.5))* .65);m.position.set(Math.cos(a)*r+product.position.x,Math.sin(a)*r*.75,Math.sin(a*.8)*2);m.rotation.set(a*.7,a,a*.5);m.scale.setScalar((.45+hero*.8)*(1-final));});ingredients.visible=p> .1&&p<5.6;
   particles.rotation.y=p*.15+idle*.012;particles.position.z=Math.sin(p)*2;pm.opacity=p>4.7?.18:.4;
   craftGroup.visible=p>2.65&&p<4.3;craftGroup.rotation.z=p*.12;craftGroup.position.z=(p-3)*3;craftGroup.scale.setScalar(Math.min(1,Math.max(0,(p-2.65)*3),Math.max(0,(4.3-p)*2)));
   camera.position.x=THREE.MathUtils.lerp(camera.position.x,mouse.x*.1,.035);camera.position.y=THREE.MathUtils.lerp(camera.position.y,-mouse.y*.08,.035);camera.lookAt(0,0,0);renderer.render(scene,camera);
  };frame();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',pointer);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});texture.dispose();pg.dispose();pm.dispose();renderer.dispose();renderer.domElement.remove();};
 },[state,onProgress]);return <div ref={host} className="webgl" aria-hidden="true"/>;
}
